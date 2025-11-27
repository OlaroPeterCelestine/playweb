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
    default: 'Play it loud | Play It Loud - Streaming Movies & Shows | playitloud.com',
    template: '%s | Play it loud',
  },
  description: 'Play it loud - Your ultimate streaming destination at playitloud.com. Binge like a boss with endless movies, TV shows, and fire content. Join Play it loud and experience premium entertainment.',
  keywords: [
    'Play it loud',
    'play it loud',
    'Play It Loud',
    'playitloud',
    'playitloud.com',
    'www.playitloud.com',
    'play it loud streaming',
    'play it loud movies',
    'play it loud shows',
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
    title: 'Play it loud | Play It Loud - Streaming Movies & Shows | playitloud.com',
    description: 'Play it loud - Your ultimate streaming destination. Binge like a boss with endless movies, TV shows, and fire content. Join Play it loud at playitloud.com.',
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
    title: 'Play it loud | Play It Loud - Streaming Movies & Shows | playitloud.com',
    description: 'Play it loud - Your ultimate streaming destination. Binge like a boss with endless movies, TV shows, and fire content. Join Play it loud!',
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
        {/* Favicon Links */}
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png" />
        <link rel="shortcut icon" type="image/png" href="https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://res.cloudinary.com/dodl9nols/image/upload/v1756723101/3_glpybd.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a0a2e" />
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
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

