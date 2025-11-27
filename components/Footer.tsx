import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        {/* Top Section - Title/Description and Social Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Title and Description */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Play It Loud © 2025
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md">
              Working with brands ready to break the mould. If you're bored of blending in drop us a line and let's bring your brand to life.
            </p>
          </div>

          {/* Right - Social Media Icons */}
          <div className="flex items-center justify-center md:justify-end gap-4 sm:gap-6">
            {/* Twitter/X */}
            <a href="#" className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors group border border-gray-700">
              <i className="fa-brands fa-x-twitter text-xl sm:text-2xl md:text-3xl text-gray-400 group-hover:text-white transition-colors"></i>
            </a>
            {/* Instagram */}
            <a href="#" className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors group border border-gray-700">
              <i className="fa-brands fa-instagram text-xl sm:text-2xl md:text-3xl text-gray-400 group-hover:text-white transition-colors"></i>
            </a>
            {/* TikTok */}
            <a href="#" className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors group border border-gray-700">
              <i className="fa-brands fa-tiktok text-xl sm:text-2xl md:text-3xl text-gray-400 group-hover:text-white transition-colors"></i>
            </a>
            {/* App Store */}
            <a href="#" className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors group border border-gray-700">
              <i className="fa-brands fa-apple text-xl sm:text-2xl md:text-3xl text-gray-400 group-hover:text-white transition-colors"></i>
            </a>
            {/* Play Store */}
            <a href="#" className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors group border border-gray-700">
              <i className="fa-brands fa-google-play text-xl sm:text-2xl md:text-3xl text-gray-400 group-hover:text-white transition-colors"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

