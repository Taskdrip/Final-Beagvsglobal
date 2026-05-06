/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.janeway.replit.dev',
    '*.repl.co',
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN] : []),
  ],
  // Production: trust Railway's reverse proxy headers
  ...(process.env.RAILWAY_ENVIRONMENT ? {
    output: 'standalone',
  } : {}),
}

export default nextConfig
