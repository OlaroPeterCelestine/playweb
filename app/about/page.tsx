import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.playitloud.com'

export const metadata: Metadata = {
  title: 'About Play it loud | Play It Loud - playitloud.com',
  description: 'Learn about Play it loud (playitloud.com) - the premier streaming platform for movies, TV shows, and premium entertainment. Discover why millions choose to Play it loud.',
  keywords: [
    'Play it loud',
    'play it loud',
    'Play It Loud',
    'playitloud',
    'playitloud.com',
    'about play it loud',
    'play it loud streaming',
  ],
  openGraph: {
    title: 'About Play it loud | Play It Loud - playitloud.com',
    description: 'Learn about Play it loud - the premier streaming platform for movies, TV shows, and premium entertainment.',
    url: `${baseUrl}/about`,
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Structured Data for About Page */}
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Play it loud",
            "description": "Learn about Play it loud (playitloud.com) - the premier streaming platform for movies, TV shows, and premium entertainment.",
            "url": baseUrl + "/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "Play It Loud",
              "alternateName": ["Play it loud", "play it loud", "playitloud", "playitloud.com", "www.playitloud.com"],
              "url": baseUrl,
              "logo": "https://res.cloudinary.com/dodl9nols/image/upload/v1756723100/6_s5lwom.png",
              "description": "Play it loud is a streaming platform offering endless movies, TV shows, and premium entertainment content."
            }
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

      {/* Header */}
      <header className="relative w-full p-3 md:p-6 flex justify-between items-center z-20">
        <Link href="/" className="w-24 sm:w-28 md:w-48 h-auto">
          <Image
            src="https://res.cloudinary.com/dodl9nols/image/upload/v1756723100/6_s5lwom.png"
            alt="Play it loud - playitloud.com Logo"
            width={192}
            height={192}
            className="w-full h-auto object-contain"
            priority
            unoptimized
          />
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm md:text-base py-1.5 px-3 sm:px-4 md:py-2 md:px-6 rounded-lg transition-colors whitespace-nowrap">
            Home
          </Link>
          <Link href="/pitch" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm md:text-base py-1.5 px-3 sm:px-4 md:py-2 md:px-6 rounded-lg transition-colors whitespace-nowrap">
            Pitch with Us
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
          About Play it loud
        </h1>

        <div className="bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl space-y-6">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What is Play it loud?</h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Play it loud</strong> (playitloud.com) is a cutting-edge streaming platform designed for entertainment enthusiasts who want to experience movies, TV shows, and premium content like never before. When you <strong className="text-white">Play it loud</strong>, you're choosing quality, variety, and an unparalleled viewing experience.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Our mission at <strong className="text-white">Play it loud</strong> is simple: to provide you with the best streaming experience possible. Whether you're looking for the latest blockbusters, classic films, trending TV series, or exclusive content, <strong className="text-white">Play it loud</strong> has everything you need to binge like a boss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Play it loud?</h2>
            <ul className="space-y-3 text-base md:text-lg text-gray-300">
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span><strong className="text-white">Play it loud</strong> offers an extensive library of movies and TV shows</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span>Premium content that slaps - only the best entertainment</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span>User-friendly interface designed for seamless streaming</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span>Regular updates with fresh content to keep you entertained</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                <span>Join the <strong className="text-white">Play it loud</strong> community and be part of the future of streaming</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Play it loud Today</h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6">
              Ready to experience the best in streaming entertainment? Join <strong className="text-white">Play it loud</strong> today and get access to our exclusive waitlist. Be among the first to experience the future of entertainment when you <strong className="text-white">Play it loud</strong>.
            </p>
            <div className="flex justify-center">
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-3 rounded-lg">
                  Join Play it loud Now
                </Button>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact Play it loud</h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Have questions about <strong className="text-white">Play it loud</strong>? Want to pitch your content? Visit our <Link href="/pitch" className="text-red-400 hover:text-red-300 underline">Pitch with Us</Link> page to submit your ideas. At <strong className="text-white">Play it loud</strong> (playitloud.com), we're always looking for fresh, exciting content to share with our community.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

