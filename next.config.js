/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.dicebear.com', 'firebasestorage.googleapis.com', 'newsapi.org']
  }
}
module.exports = nextConfig;
