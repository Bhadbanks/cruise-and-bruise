// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add image domains if you plan to use external URLs (e.g., from Firestore storage)
  // For a basic setup, this might not be strictly necessary if all images are in /public
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      // You can add other remote image hosts here if needed
    ],
  },
  
  // Important for older packages or complex setups, but often good to include
  reactStrictMode: true,
};

module.exports = nextConfig;
