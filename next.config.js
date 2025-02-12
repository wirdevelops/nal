const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development' // Keep this commented out or adjust as needed
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['fonts.gstatic.com'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match any path starting with /api
        destination: 'http://localhost:8080/api/:path*', // Proxy to your Go server
      },
    ];
  },
};

module.exports = withPWA(nextConfig);