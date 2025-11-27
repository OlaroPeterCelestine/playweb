import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.playitloud.com'

export const metadata: Metadata = {
  title: 'Pitch with Us - Play It Loud | playitloud.com',
  description: 'Submit your content pitch to Play It Loud (playitloud.com). Share your creative ideas for movies, shows, and entertainment content. Join our platform and get your content featured.',
  keywords: [
    'Play It Loud',
    'playitloud',
    'playitloud.com',
    'pitch content',
    'submit content',
    'content creators',
    'streaming platform',
    'entertainment pitch',
  ],
  openGraph: {
    title: 'Pitch with Us - Play It Loud | playitloud.com',
    description: 'Submit your content pitch to Play It Loud. Share your creative ideas for movies, shows, and entertainment content.',
    url: `${baseUrl}/pitch`,
  },
  alternates: {
    canonical: `${baseUrl}/pitch`,
  },
}

export default function PitchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

