import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'fallback'
})

export const metadata: Metadata = {
  title: 'Play It Loud - Vibe with endless movies',
  description: 'Join Play It Loud and access endless movies, TV shows, and fire content',
  icons: {
    icon: 'https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body 
        className={`${inter.className} bg-[#1a0a2e]`} 
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

