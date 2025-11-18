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

