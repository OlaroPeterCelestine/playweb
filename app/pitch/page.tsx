'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function PitchPage() {
  const router = useRouter()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Allow various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validateURL = (url: string): boolean => {
    try {
      const urlObj = new URL(url.trim())
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      const name = (formData.get('name') as string || '').trim()
      const email = (formData.get('email') as string || '').trim()
      const phone = (formData.get('phone') as string || '').trim()
      const title = (formData.get('title') as string || '').trim()
      const description = (formData.get('description') as string || '').trim()
      const url = (formData.get('url') as string || '').trim()
      
      const newErrors: Record<string, string> = {}

      // Validate name
      if (!name || name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters long'
      }

      // Validate email
      if (!email) {
        newErrors.email = 'Email is required'
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      // Validate phone
      if (!phone) {
        newErrors.phone = 'Phone number is required'
      } else if (!validatePhone(phone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      // Validate title
      if (!title || title.length < 3) {
        newErrors.title = 'Pitch title must be at least 3 characters long'
      }

      // Validate description
      if (!description || description.length < 10) {
        newErrors.description = 'Pitch description must be at least 10 characters long'
      }

      // Validate URL
      if (!url) {
        newErrors.url = 'Pitch URL is required'
      } else if (!validateURL(url)) {
        newErrors.url = 'Please enter a valid URL (must start with http:// or https://)'
      }

      // If there are errors, display them and stop submission
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsSubmitting(false)
        // Scroll to first error
        const firstErrorField = Object.keys(newErrors)[0]
        const errorElement = document.getElementById(firstErrorField) || document.querySelector(`[name="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          errorElement.focus()
        }
        return
      }
      
      // Save to Firebase Firestore "pitches" collection
      if (!db) {
        throw new Error('Firebase Firestore is not initialized')
      }

      const pitchData = {
        name: name,
        email: email.toLowerCase(),
        phone: phone,
        title: title,
        description: description,
        type: 'url',
        files: [],
        url: url,
        status: 'pending',
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp()
      }

      // Add to Firebase Firestore pitches collection
      const pitchesRef = collection(db, 'pitches')
      const docRef = await addDoc(pitchesRef, pitchData)
      
      if (docRef.id) {
        // Send confirmation email after successful database save
        let emailSent = false
        try {
          const emailResponse = await fetch('/api/send-pitch-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email.toLowerCase(),
              name: name,
              pitchTitle: title
            })
          })
          
          const emailResult = await emailResponse.json()
          if (emailResult.success) {
            emailSent = true
            console.log('Pitch confirmation email sent successfully to:', email)
          } else {
            console.warn('Email sending returned error:', emailResult.message)
          }
        } catch (emailError) {
          // Don't throw - email failure shouldn't block the pitch submission
          // Data is already saved to database
          console.error('Failed to send confirmation email:', emailError)
        }
        
        setFormSubmitted(true)
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        throw new Error('Failed to save pitch to database')
      }
    } catch (error) {
      // Production: Show user-friendly error message
      alert('Failed to submit pitch: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen text-white py-20 md:py-8">
      {/* Scrolling Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 w-[200%] h-full bg-cover bg-center animate-scroll-bg"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dodl9nols/image/upload/v1757338625/Untitled-2_1_cdpvt6.jpg)',
          }}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-3 md:p-6 z-20">
        <Link href="/" className="w-28 md:w-48 h-auto inline-block">
          <Image
            src="https://res.cloudinary.com/dodl9nols/image/upload/v1756723100/6_s5lwom.png"
            alt="Play It Loud"
            width={192}
            height={192}
            className="w-full h-auto object-contain"
            unoptimized
          />
        </Link>
      </header>

      <div className="relative z-10 px-4 sm:px-6 py-16 md:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-3 sm:mb-4 px-2">
            Pitch Your Idea
          </h1>
          <p className="text-base sm:text-lg text-gray-300 text-center mb-8 sm:mb-12 px-2">
            Share your creative vision with us. Submit your pitch link and let's make it happen.
          </p>

          {!formSubmitted ? (
            <div className="bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Your Name */}
                <div>
                  <label htmlFor="name" className="block text-sm sm:text-base font-semibold mb-2">Name or Company Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={`bg-gray-800/50 border text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3 ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter your name or company name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={`bg-gray-800/50 border text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3 ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm sm:text-base font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className={`bg-gray-800/50 border text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3 ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Pitch Title */}
                <div>
                  <label htmlFor="title" className="block text-sm sm:text-base font-semibold mb-2">Pitch Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className={`bg-gray-800/50 border text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3 ${
                      errors.title ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Give your pitch a catchy title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm sm:text-base font-semibold mb-2">Pitch Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    required
                    className={`bg-gray-800/50 border text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3 ${
                      errors.description ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Describe your pitch in detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                  )}
                </div>

                {/* URL Input Section */}
                <div>
                  <label htmlFor="url" className="block text-sm sm:text-base font-semibold mb-2">Pitch Link (URL)</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    required
                    className={`bg-gray-800/50 border text-white placeholder-gray-400 text-sm sm:text-base rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 sm:p-3 ${
                      errors.url ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter URL to your pitch (e.g., https://example.com/pitch.pdf)"
                  />
                  {errors.url && (
                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.url}</p>
                  )}
                  <p className="mt-2 text-xs sm:text-sm text-gray-400">
                    Share a link to your pitch document, presentation, or video (Google Drive, Dropbox, website, etc.)
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-bold rounded-lg text-base sm:text-lg px-5 py-3 sm:py-4 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Pitch'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="mt-6 bg-green-600/90 backdrop-blur-sm p-4 sm:p-6 rounded-lg text-center mx-2 sm:mx-0">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">✓</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Pitch Submitted Successfully!</h2>
              <p className="text-sm sm:text-base text-gray-200 mb-2">We've received your pitch and sent a confirmation email to your inbox.</p>
              <p className="text-sm sm:text-base text-gray-200 mb-4">We'll review your submission and get back to you soon.</p>
              <p className="text-gray-300 text-xs sm:text-sm">Redirecting to home page in a few seconds...</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

