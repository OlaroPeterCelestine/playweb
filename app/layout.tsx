import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'fallback'
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.playitloud.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Play It Loud | Playitloud - Movies, Shows & Content That Slaps',
    template: '%s | Play It Loud',
  },
  description: 'Play It Loud (playitloud.com) - Your ultimate streaming destination. Binge like a boss with endless movies, TV shows, and fire content. Join the waitlist and experience the future of entertainment.',
  keywords: [
    'Play It Loud',
    'playitloud',
    'playitloud.com',
    'www.playitloud.com',
    'streaming',
    'movies',
    'TV shows',
    'entertainment',
    'binge watch',
    'streaming platform',
    'online movies',
    'watch movies online',
    'streaming service',
  ],
  authors: [{ name: 'Play It Loud' }],
  creator: 'Play It Loud',
  publisher: 'Play It Loud',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Play It Loud',
    title: 'Play It Loud | Playitloud - Movies, Shows & Content That Slaps',
    description: 'Binge like a boss with endless movies, TV shows, and fire content. Join Play It Loud and experience the future of streaming.',
    images: [
      {
        url: 'https://res.cloudinary.com/dodl9nols/image/upload/v1757338623/PLAY_YOUTUBE_BANNER_Kansiime_fr3yop.jpg',
        width: 1200,
        height: 630,
        alt: 'Play It Loud - Streaming Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Play It Loud | Playitloud - Movies, Shows & Content That Slaps',
    description: 'Binge like a boss with endless movies, TV shows, and fire content. Join Play It Loud!',
    images: ['https://res.cloudinary.com/dodl9nols/image/upload/v1757338623/PLAY_YOUTUBE_BANNER_Kansiime_fr3yop.jpg'],
    creator: '@playitloud',
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: 'https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png',
    apple: 'https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png',
  },
  verification: {
    // Add your Google Search Console verification code here when available
    // google: 'your-verification-code',
  },
  category: 'entertainment',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove Vercel toolbar
                const removeVercelToolbar = () => {
                  const toolbar = document.querySelector('[data-vercel-toolbar]') || 
                                 document.querySelector('#__vercel-toolbar') ||
                                 document.querySelector('iframe[src*="vercel"]');
                  if (toolbar) {
                    toolbar.remove();
                  }
                  // Also remove any Vercel toolbar styles
                  const style = document.querySelector('style[data-vercel-toolbar]');
                  if (style) {
                    style.remove();
                  }
                };
                // Run immediately
                removeVercelToolbar();
                // Run after DOM is loaded
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', removeVercelToolbar);
                }
                // Run after page is fully loaded
                window.addEventListener('load', removeVercelToolbar);
                // Use MutationObserver to catch dynamically added toolbars
                const observer = new MutationObserver(removeVercelToolbar);
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
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

