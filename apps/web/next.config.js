/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@reclama-golpe/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
