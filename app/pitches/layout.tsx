import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.playitloud.com'

export const metadata: Metadata = {
  title: 'View Pitches - Play It Loud | playitloud.com',
  description: 'Browse and view content pitches submitted to Play It Loud (playitloud.com). Discover creative ideas and entertainment content from our community.',
  keywords: [
    'Play It Loud',
    'playitloud',
    'playitloud.com',
    'content pitches',
    'view pitches',
    'streaming content',
    'entertainment ideas',
  ],
  openGraph: {
    title: 'View Pitches - Play It Loud | playitloud.com',
    description: 'Browse and view content pitches submitted to Play It Loud. Discover creative ideas and entertainment content.',
    url: `${baseUrl}/pitches`,
  },
  alternates: {
    canonical: `${baseUrl}/pitches`,
  },
  robots: {
    index: false, // Usually admin pages shouldn't be indexed
    follow: false,
  },
}

export default function PitchesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

