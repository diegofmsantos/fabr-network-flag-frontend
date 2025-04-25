/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove a configuração do analytics daqui, pois já está no layout.tsx
  
  reactStrictMode: true,
  
  images: {
    domains: ['assets.vercel.com'],
    unoptimized: true,
  },
};

export default nextConfig;