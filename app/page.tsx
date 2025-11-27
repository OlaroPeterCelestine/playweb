'use client'

import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useState, FormEvent, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function Home() {
  const { saveDataWithGoogle } = useAuth()
  const [isSavingWithGoogle, setIsSavingWithGoogle] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [hasPrefilled, setHasPrefilled] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Read URL parameters and pre-fill form, then clean URL
  useEffect(() => {
    if (hasPrefilled || typeof window === 'undefined') return // Only run once and in browser

    const urlParams = new URLSearchParams(window.location.search)
    const fullName = urlParams.get('fullName')
    const email = urlParams.get('email')
    const phone = urlParams.get('phone')

    if (fullName || email || phone) {
      setFormData({
        fullName: fullName ? decodeURIComponent(fullName.replace(/\+/g, ' ')) : '',
        email: email ? decodeURIComponent(email) : '',
        phone: phone ? decodeURIComponent(phone) : ''
      })
      setHasPrefilled(true)
      
      // Clean URL immediately by removing query parameters (without page reload)
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname)
      }

      // Note: Form is pre-filled, but we don't show a dialog for this
      // User can see the form is filled and proceed to submit
    }
  }, [hasPrefilled])

  const handleGoogleDataSave = async () => {
    try {
      setIsSavingWithGoogle(true)
      setSubmitMessage(null)
      setIsDialogOpen(false)
      // saveDataWithGoogle handles: get Google user data, save to Firestore, and send confirmation email
      await saveDataWithGoogle()
      setSubmitMessage({ 
        type: 'success', 
        text: 'Success! Your data has been saved and a confirmation email has been sent to your inbox. We\'ll be in touch soon!' 
      })
      setIsDialogOpen(true)
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save your data with Google. Please try again or use the form below.'
      setSubmitMessage({ 
        type: 'error', 
        text: errorMessage
      })
      setIsDialogOpen(true)
    } finally {
      setIsSavingWithGoogle(false)
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all fields' })
      setIsDialogOpen(true)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address' })
      setIsDialogOpen(true)
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitMessage(null)
      setIsDialogOpen(false)

      if (!db) {
        throw new Error('Firestore is not initialized. Please refresh the page.')
      }

      const emailToCheck = formData.email.trim().toLowerCase()
      const phoneToCheck = formData.phone.trim()

      // Check for duplicate email
      const emailQuery = query(
        collection(db, 'waitlist'),
        where('email', '==', emailToCheck)
      )
      const emailSnapshot = await getDocs(emailQuery)

      // Check for duplicate phone
      const phoneQuery = query(
        collection(db, 'waitlist'),
        where('phone', '==', phoneToCheck)
      )
      const phoneSnapshot = await getDocs(phoneQuery)

      // Check if duplicates exist
      if (!emailSnapshot.empty) {
        setSubmitMessage({ 
          type: 'error', 
          text: 'This email is already registered. Please use a different email address.' 
        })
        setIsDialogOpen(true)
        setIsSubmitting(false)
        return
      }

      if (!phoneSnapshot.empty) {
        setSubmitMessage({ 
          type: 'error', 
          text: 'This phone number is already registered. Please use a different phone number.' 
        })
        setIsDialogOpen(true)
        setIsSubmitting(false)
        return
      }

      const dataToSave = {
        fullName: formData.fullName.trim(),
        email: emailToCheck,
        phone: phoneToCheck,
        userId: null,
        userEmail: null,
        createdAt: serverTimestamp()
      }

      // Save to Firestore (no duplicates found)
      // This await ensures the data is fully written to Firestore before proceeding
      // addDoc returns a DocumentReference ONLY after successful write to Firestore
      const docRef = await addDoc(collection(db, 'waitlist'), dataToSave)
      
      // Verify document was created successfully
      // docRef.id exists ONLY if the document was successfully created in Firestore
      // If addDoc fails, it throws an error before reaching this point
      if (!docRef || !docRef.id) {
        throw new Error('Failed to create document in Firestore - no document ID returned')
      }

      // Send confirmation email after successful database save
      let emailSent = false
      try {
        const emailResponse = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailToCheck,
            fullName: formData.fullName.trim()
          })
        })
        
        const emailResult = await emailResponse.json()
        if (emailResult.success) {
          emailSent = true
          console.log('Confirmation email sent successfully to:', emailToCheck)
        } else {
          console.warn('Email sending returned error:', emailResult.message)
        }
      } catch (emailError) {
        // Don't throw - email failure shouldn't block the signup
        // Data is already saved to database
        console.error('Failed to send confirmation email:', emailError)
      }

      // Success - Data is confirmed saved to 'waitlist' collection in Firestore
      // The fact that we have docRef.id means:
      // 1. The document was successfully created
      // 2. Firestore returned a document ID
      // 3. The data is now in the 'waitlist' collection
      // 4. If any error occurred, addDoc would have thrown an exception
      const successMessage = emailSent 
        ? 'Success! Your data has been saved and a confirmation email has been sent to your inbox. We\'ll be in touch soon!'
        : 'Success! Your data has been saved to our waitlist. We\'ll be in touch soon!'
      
      setSubmitMessage({ 
        type: 'success', 
        text: successMessage
      })
      setIsDialogOpen(true)
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: ''
      })

      // Clean URL by removing any query parameters
      if (window.location.search && window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname)
      }
    } catch (error: any) {
      let errorMessage = 'Failed to save your details. Please try again.'
      
      // Provide more specific error messages
      if (error?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firestore security rules.'
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Firestore is unavailable. Please check your internet connection.'
      }
      
      setSubmitMessage({ type: 'error', text: errorMessage })
      setIsDialogOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  return (
    <div className="relative min-h-screen text-white">
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17762940050"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17762940050');
        `}
      </Script>
      
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Play It Loud",
            "alternateName": "playitloud",
            "url": "https://www.playitloud.com",
            "logo": "https://res.cloudinary.com/dodl9nols/image/upload/v1756723100/6_s5lwom.png",
            "description": "Play It Loud (playitloud.com) - Your ultimate streaming destination. Binge like a boss with endless movies, TV shows, and fire content.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.playitloud.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "sameAs": [
              "https://www.playitloud.com"
            ]
          })
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Play It Loud",
            "alternateName": ["playitloud", "playitloud.com", "www.playitloud.com"],
            "url": "https://www.playitloud.com",
            "logo": "https://res.cloudinary.com/dodl9nols/image/upload/v1756723100/6_s5lwom.png",
            "description": "Play It Loud is a streaming platform offering endless movies, TV shows, and premium content. Binge like a boss with the best entertainment experience.",
            "foundingDate": "2025",
            "sameAs": [
              "https://www.playitloud.com"
            ]
          })
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Streaming Service",
            "provider": {
              "@type": "Organization",
              "name": "Play It Loud",
              "alternateName": "playitloud"
            },
            "areaServed": "Worldwide",
            "description": "Streaming service for movies, TV shows, and premium entertainment content",
            "name": "Play It Loud Streaming Service"
          })
        }}
      />
      
      {/* Scrolling Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 w-[200%] h-full bg-cover bg-center animate-scroll-bg"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dodl9nols/image/upload/v1757338625/Untitled-2_1_cdpvt6.jpg)',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 md:py-0">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-3 md:p-6 flex justify-between items-center z-20">
          <div className="w-24 sm:w-28 md:w-48 h-auto">
            <Image
              src="https://res.cloudinary.com/dodl9nols/image/upload/v1756723100/6_s5lwom.png"
              alt="Play It Loud - playitloud.com - Streaming Platform Logo"
              width={192}
              height={192}
              className="w-full h-auto object-contain"
              priority
              unoptimized
            />
          </div>
          <Link href="/pitch" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm md:text-base py-1.5 px-3 sm:px-4 md:py-2 md:px-6 rounded-lg transition-colors whitespace-nowrap">
            Pitch with Us
          </Link>
        </header>

        {/* Main Content */}
        <main className="text-center z-10 flex flex-col items-center w-full max-w-4xl pt-16 sm:pt-20 md:pt-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight px-2 mb-2">
            Play It Loud - Binge Like a Boss
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 px-2">
            Movies. Shows. Content that slaps.
          </p>
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-bold text-white px-2">
            You Ready to Play it Loud?
          </h2>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white px-2">
            Drop your details - we're saving your spot on the inside.
          </p>

          <Button 
            onClick={handleGoogleDataSave}
            disabled={isSavingWithGoogle}
            className="mt-6 sm:mt-8 w-full sm:w-auto bg-white text-gray-800 font-medium py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 sm:gap-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingWithGoogle ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-[15px] font-medium">Saving your data...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-[15px] font-medium">Quick Add with Google</span>
              </>
            )}
          </Button>

          <p className="my-4 sm:my-6 text-sm sm:text-base text-gray-400 px-2">or fill out the form below</p>

          <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-2xl mx-2 sm:mx-4">
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                  className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  required
                  className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3"
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-bold rounded-lg text-base sm:text-lg px-5 py-2.5 sm:py-3 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : "Let's Play"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modal Dialog */}
      {submitMessage && (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSubmitMessage(null)
          }
        }}>
          <DialogContent 
            onClose={() => {
              setIsDialogOpen(false)
              setSubmitMessage(null)
            }}
            className={submitMessage.type === 'success' ? 'border-green-500/50' : 'border-red-500/50'}
          >
            <DialogHeader>
              {submitMessage.type === 'success' ? (
                <>
                  <div className="flex items-center justify-center mb-4 -mt-2">
                    <div className="rounded-full bg-green-500/20 p-4">
                      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center text-green-400">
                    Success!
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-300 text-base mt-3">
                    {submitMessage.text}
                  </DialogDescription>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-4 -mt-2">
                    <div className="rounded-full bg-red-500/20 p-4">
                      <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center text-red-400">
                    Error
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-300 text-base mt-3">
                    {submitMessage.text}
                  </DialogDescription>
                </>
              )}
            </DialogHeader>
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => {
                  setIsDialogOpen(false)
                  setSubmitMessage(null)
                }}
                className={submitMessage.type === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white px-8 py-2' 
                  : 'bg-red-600 hover:bg-red-700 text-white px-8 py-2'
                }
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

