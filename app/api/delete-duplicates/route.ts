import { NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBq8p7f-0gokiALj6DlBsF-l3lunEUw7Sk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "playitloud-1e8fe.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "playitloud-1e8fe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "playitloud-1e8fe.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "547064693002",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:547064693002:web:bc750b0c3ec51153c53af3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4PDMHWGK48"
}

// Initialize Firebase
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

const db = getFirestore(app)

interface WaitlistEntry {
  id: string
  fullName?: string
  email?: string
  phone?: string
  userId?: string
  userEmail?: string
  createdAt?: any
  signInMethod?: string
  lastSignIn?: any
}

export async function POST() {
  try {
    const waitlistRef = collection(db, 'waitlist')
    const snapshot = await getDocs(waitlistRef)
    const total = snapshot.size

    if (total === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No users found',
        total: 0,
        deleted: 0,
        final: 0
      })
    }

    // Parse all documents
    const entries: WaitlistEntry[] = []
    snapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      } as WaitlistEntry)
    })

    // Find duplicates by email
    const emailMap = new Map<string, WaitlistEntry[]>()
    entries.forEach(entry => {
      const email = entry.email?.toLowerCase().trim() || ''
      if (email) {
        if (!emailMap.has(email)) {
          emailMap.set(email, [])
        }
        emailMap.get(email)!.push(entry)
      }
    })

    // Find duplicates by phone
    const phoneMap = new Map<string, WaitlistEntry[]>()
    entries.forEach(entry => {
      const phone = entry.phone?.trim() || ''
      if (phone) {
        if (!phoneMap.has(phone)) {
          phoneMap.set(phone, [])
        }
        phoneMap.get(phone)!.push(entry)
      }
    })

    // Find entries to delete
    const toDelete = new Set<string>()

    // Process email duplicates (keep the oldest)
    emailMap.forEach((duplicates) => {
      if (duplicates.length > 1) {
        const sorted = duplicates.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0
          const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0
          return aTime - bTime
        })
        for (let i = 1; i < sorted.length; i++) {
          toDelete.add(sorted[i].id)
        }
      }
    })

    // Process phone duplicates (keep the oldest)
    phoneMap.forEach((duplicates) => {
      if (duplicates.length > 1) {
        const sorted = duplicates.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt || 0
          const bTime = b.createdAt?.toMillis?.() || b.createdAt || 0
          return aTime - bTime
        })
        for (let i = 1; i < sorted.length; i++) {
          if (!toDelete.has(sorted[i].id)) {
            toDelete.add(sorted[i].id)
          }
        }
      }
    })

    const totalToDelete = toDelete.size
    const finalCount = total - totalToDelete

    if (totalToDelete === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No duplicates found',
        total,
        deleted: 0,
        final: total
      })
    }

    // Delete duplicates
    let deletedCount = 0
    let errorCount = 0

    const entriesToDelete = Array.from(toDelete)
    for (const entryId of entriesToDelete) {
      try {
        const docRef = doc(db, 'waitlist', entryId)
        await deleteDoc(docRef)
        deletedCount++
      } catch (error) {
        errorCount++
        console.error(`Error deleting ${entryId}:`, error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${deletedCount} duplicate entries`,
      total,
      deleted: deletedCount,
      errors: errorCount,
      final: finalCount
    })
  } catch (error: any) {
    console.error('Error deleting duplicates:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}


