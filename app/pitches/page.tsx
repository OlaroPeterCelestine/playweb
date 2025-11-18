'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PitchSubmission {
  id?: string
  name: string
  email: string
  phone: string
  title: string
  description: string
  type: string
  files?: string[]
  url?: string
  status?: string
  createdAt?: Timestamp | Date | string
  submittedAt?: Timestamp | Date | string
  created_at?: string
}

export default function PitchesPage() {
  const [pitches, setPitches] = useState<PitchSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPitches = async () => {
    if (!db) {
      setError('Firebase Firestore is not initialized')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch pitches from Firebase Firestore
      const pitchesRef = collection(db, 'pitches')
      let querySnapshot
      try {
        // Try to order by createdAt first
        const q = query(pitchesRef, orderBy('createdAt', 'desc'))
        querySnapshot = await getDocs(q)
      } catch (error) {
        // If ordering fails (e.g., no createdAt field), fetch without ordering
        querySnapshot = await getDocs(pitchesRef)
      }
      
      const pitchesData: PitchSubmission[] = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'url',
          files: data.files || [],
          url: data.url || '',
          status: data.status || 'pending',
          createdAt: data.createdAt,
          submittedAt: data.submittedAt,
          created_at: data.createdAt?.toDate?.()?.toISOString() || 
                     (data.createdAt instanceof Date ? data.createdAt.toISOString() : 
                     (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()))
        }
      })
      
      setPitches(pitchesData)
    } catch (error: any) {
      setError(error?.message || 'Failed to fetch pitches')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPitches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString()
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString()
      }
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString()
      }
      return 'N/A'
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Pitches</h1>
            <p className="text-gray-400">Review and manage startup pitches submitted by founders</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={fetchPitches}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            <Link href="/admin/dashboard">
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Total Pitches</CardTitle>
            <CardDescription>Total pitch submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pitches.length}</div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-900/20 border-red-700 mb-6">
            <CardContent className="py-4">
              <p className="text-red-400">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading pitches...</p>
            </CardContent>
          </Card>
        ) : pitches.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <p className="text-xl text-gray-300 mb-2">No pitches found</p>
              <p className="text-sm text-gray-400 mb-4">Submit a pitch to get started</p>
              <Link href="/pitch">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Submit a Pitch
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pitches.map((pitch) => (
              <Card 
                key={pitch.id} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">{pitch.title}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <span>👤</span>
                          <span>{pitch.name}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📧</span>
                          <span>{pitch.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📞</span>
                          <span>{pitch.phone}</span>
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end flex-shrink-0">
                      <Badge 
                        variant={pitch.type === 'upload' ? 'default' : 'secondary'}
                        className={pitch.type === 'upload' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'}
                      >
                        {pitch.type}
                      </Badge>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(pitch.created_at || pitch.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{pitch.description}</p>
                  
                  {pitch.type === 'url' && pitch.url && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-400 mb-1">🔗 URL:</p>
                      <a 
                        href={pitch.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm break-all"
                      >
                        {pitch.url}
                      </a>
                    </div>
                  )}
                  
                  {pitch.type === 'upload' && pitch.files && pitch.files.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-400 mb-1">📎 Files:</p>
                      <div className="flex flex-wrap gap-2">
                        {pitch.files.map((file, idx) => {
                          const isUrl = file.startsWith('http://') || file.startsWith('https://')
                          const fileName = isUrl ? file.split('/').pop()?.split('?')[0] || `File ${idx + 1}` : file
                          return (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className={`bg-gray-700 border-gray-600 ${isUrl ? 'hover:bg-gray-600 cursor-pointer' : ''}`}
                            >
                              {isUrl ? (
                                <a 
                                  href={file} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {fileName}
                                </a>
                              ) : (
                                file
                              )}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

