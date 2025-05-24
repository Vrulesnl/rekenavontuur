// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
});

module.exports = withPWA({
  reactStrictMode: true,
  // eventueele rewrites:
  // rewrites: async () => [
  //   { source: '/stadion/:stadion*', destination: '/' }
  // ]
});