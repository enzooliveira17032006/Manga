/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*', // Proxy to Express backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
      },
      // Allowed image proxies if needed directly
    ],
  },
};

export default nextConfig;
