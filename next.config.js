/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Vercel deployment optimizations
  poweredByHeader: false,
  
  // Enable experimental features if needed
  experimental: {
    // serverActions: true, // Already enabled by default in Next 14
  },
}

module.exports = nextConfig
