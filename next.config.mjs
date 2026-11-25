import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '0.0.0.0',
      },
      {
        protocol: 'https',
        hostname: 'dam.mediacorp.sg',
      },
      {
        protocol: 'https',
        hostname: 'media-cldnry.s-nbcnews.com',
      },
      {
        protocol: 'https',
        hostname: 'instantlyfeed.com',
      },
      {
        protocol: 'https',
        hostname: 'www.instantlyfeed.com',
      },
      {
        protocol: 'https',
        hostname: 'pulefeed.tech',
      },
      {
        protocol: 'https',
        hostname: 'www.pulefeed.tech',
      },
      {
        protocol: 'https',
        hostname: 'www.aljazeera.com',
      },
      {
        protocol: 'https',
        hostname: 'aljazeera.com',
      },
    ],
  },
  async rewrites() {
    return {
      // `next start` only serves public/ files that existed at build time, so
      // uploads made after a deploy 404 for the image optimizer (which fetches
      // /media/* from this server, bypassing nginx). Fall back to Payload's
      // runtime file route, which reads public/media from disk on each request.
      fallback: [
        {
          source: '/media/:path*',
          destination: '/api/media/file/:path*',
        },
      ],
    }
  },
}

export default withPayload(nextConfig)
