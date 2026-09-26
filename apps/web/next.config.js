/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@p2d/shared',
    '@p2d/auth',
    '@p2d/database',
    '@p2d/ai',
    '@p2d/voice',
    '@p2d/telephony',
    '@p2d/workflows',
    '@p2d/integrations',
  ],
};

module.exports = nextConfig;
