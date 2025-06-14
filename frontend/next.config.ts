import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "",
  // output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3030/api/:path*'
      }
    ]
  }
};

export default nextConfig;
