/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ✅ Explicitly expose safe environment variables to the client
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    NEXT_PUBLIC_ADMIN_PASS: process.env.NEXT_PUBLIC_ADMIN_PASS,
    NEXT_PUBLIC_GC_LINK: process.env.NEXT_PUBLIC_GC_LINK,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    NEXT_PUBLIC_WHATSAPP_CONTACT: process.env.NEXT_PUBLIC_WHATSAPP_CONTACT,
  },

  // ✅ Optimize for serverless Vercel functions
  output: 'standalone',

  // ✅ Disable telemetry collection
  telemetry: false,

  // ✅ Custom build options for smoother deployments
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // removes console.logs in prod
  },

  // ✅ Allow remote image domains (if you display news/user avatars)
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'cdn.pixabay.com'
    ],
  },
};

module.exports = nextConfig;
