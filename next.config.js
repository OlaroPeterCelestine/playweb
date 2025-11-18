/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for file manager upload
  output: 'export',
  
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Exclude Trash and other unnecessary directories from webpack watching
  webpack: (config) => {
    // Exclude Trash folder from being watched (only string glob patterns allowed)
    if (config.watchOptions) {
      config.watchOptions.ignored = [
        ...(Array.isArray(config.watchOptions.ignored) ? config.watchOptions.ignored : []),
        '**/node_modules/**',
        '**/.git/**',
        '**/.Trash/**',
        '**/Trash/**',
        '**/*/.Trash/**',
        '**/*/Trash/**',
      ].filter(Boolean) // Remove any empty strings
    } else {
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.Trash/**',
          '**/Trash/**',
          '**/*/.Trash/**',
          '**/*/Trash/**',
        ],
      }
    }
    
    // Add a plugin to ignore Trash files during module resolution
    config.plugins = config.plugins || []
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.normalModuleFactory.tap('ExcludeTrash', (nmf) => {
          nmf.hooks.beforeResolve.tap('ExcludeTrash', (data) => {
            if (data && data.request) {
              const requestPath = data.request
              if (
                requestPath.includes('.Trash') ||
                requestPath.includes('/Trash/') ||
                requestPath.includes('\\Trash\\')
              ) {
                return false // Ignore this module
              }
            }
          })
        })
      },
    })
    
    return config
  },
}

module.exports = nextConfig

