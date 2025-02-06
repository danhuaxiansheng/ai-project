/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
