'use client'

import { createContext, useContext, ReactNode } from 'react'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut
} from 'firebase/auth'
import { auth, db } from './firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'

interface AuthContextType {
  saveDataWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const saveDataWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized')
    }
    if (!db) {
      throw new Error('Firestore is not initialized')
    }

    const provider = new GoogleAuthProvider()
    
    try {
      // Sign in with Google to get user data
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const email = user.email?.toLowerCase() || ''
      
      // Check if user already exists in waitlist by email
      const emailQuery = query(
        collection(db, 'waitlist'),
        where('email', '==', email)
      )
      const emailSnapshot = await getDocs(emailQuery)

      // If user already exists, throw error
      if (!emailSnapshot.empty) {
        // Sign out immediately since we don't want to maintain a session
        await firebaseSignOut(auth)
        throw new Error('This email is already registered in our waitlist.')
      }

      // Save user data to Firestore waitlist collection
      const userData = {
        fullName: user.displayName || '',
        email: email,
        phone: user.phoneNumber || '',
        userId: user.uid,
        userEmail: user.email || '',
        createdAt: serverTimestamp(),
        signInMethod: 'google'
      }

      // Save user data to Firestore waitlist collection
      const docRef = await addDoc(collection(db, 'waitlist'), userData)
      
      // Verify document was created successfully
      if (!docRef || !docRef.id) {
        throw new Error('Failed to save data to database')
      }

      // Send confirmation email after successful database save
      try {
        const emailResponse = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            fullName: user.displayName || ''
          })
        })
        
        const emailResult = await emailResponse.json()
        if (emailResult.success) {
          console.log('Confirmation email sent successfully to:', email)
        } else {
          console.warn('Email sending returned error:', emailResult.message)
        }
      } catch (emailError) {
        // Don't throw - email failure shouldn't block the signup
        // Data is already saved to database
        console.error('Failed to send confirmation email:', emailError)
      }

      // Sign out immediately after saving data (we don't want to maintain a session)
      await firebaseSignOut(auth)
    } catch (error: any) {
      // Make sure to sign out even if there's an error
      try {
        await firebaseSignOut(auth)
      } catch (signOutError) {
        // Ignore sign out errors
      }
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ saveDataWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

