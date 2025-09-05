import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },

  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/api/:path*',
        destination: isDevelopment 
          ? 'http://localhost:3000/api/:path*'
          : 'https://api.smare.org/api/:path*',
      },
    ];
  },

  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;