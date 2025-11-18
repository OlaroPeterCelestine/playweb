export function Footer() {
  return (
    <footer className="w-full p-4 sm:p-6 md:p-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">Connect With Us</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {/* Play Store Card */}
          <a href="#" className="bg-gray-800/90 hover:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] transition-colors">
            <i className="fab fa-google-play text-2xl sm:text-3xl md:text-4xl mb-2 text-white"></i>
            <h3 className="font-bold text-white text-xs sm:text-sm md:text-base">Play Store</h3>
            <p className="text-xs md:text-sm text-gray-300 text-center">Get our app on Google Play</p>
          </a>

          {/* App Store Card */}
          <a href="#" className="bg-gray-800/90 hover:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] transition-colors">
            <i className="fab fa-apple text-2xl sm:text-3xl md:text-4xl mb-2 text-white"></i>
            <h3 className="font-bold text-white text-xs sm:text-sm md:text-base">App Store</h3>
            <p className="text-xs md:text-sm text-gray-300 text-center">Download on the App Store</p>
          </a>

          {/* Instagram Card */}
          <a href="#" className="bg-gray-800/90 hover:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] transition-colors">
            <i className="fab fa-instagram text-2xl sm:text-3xl md:text-4xl mb-2 text-white"></i>
            <h3 className="font-bold text-white text-xs sm:text-sm md:text-base">Instagram</h3>
            <p className="text-xs md:text-sm text-gray-300 text-center">Follow us on Instagram</p>
          </a>

          {/* Twitter Card */}
          <a href="#" className="bg-gray-800/90 hover:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] transition-colors">
            <i className="fab fa-twitter text-2xl sm:text-3xl md:text-4xl mb-2 text-white"></i>
            <h3 className="font-bold text-white text-xs sm:text-sm md:text-base">Twitter</h3>
            <p className="text-xs md:text-sm text-gray-300 text-center">Follow us on Twitter</p>
          </a>

          {/* TikTok Card */}
          <a href="#" className="bg-gray-800/90 hover:bg-gray-700 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[140px] transition-colors">
            <i className="fab fa-tiktok text-2xl sm:text-3xl md:text-4xl mb-2 text-white"></i>
            <h3 className="font-bold text-white text-xs sm:text-sm md:text-base">TikTok</h3>
            <p className="text-xs md:text-sm text-gray-300 text-center">Follow us on TikTok</p>
          </a>
        </div>

        <p className="text-sm md:text-base text-white text-center">© 2025 Play It Loud. All rights reserved.</p>
      </div>
    </footer>
  )
}

