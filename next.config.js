/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};
module.exports = nextConfig;
