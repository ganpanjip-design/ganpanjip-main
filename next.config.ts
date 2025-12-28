import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ganpanjip-images.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.EC2_API_URL}/api/:path*`, // 
      },
    ];
  },
};

export default nextConfig;