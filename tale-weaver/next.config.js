/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // 添加对 canvas 的支持
    config.externals = [...(config.externals || []), { canvas: "canvas" }];

    // 添加对 Worker 的支持
    config.resolve.fallback = {
      ...config.resolve.fallback,
      worker_threads: false,
      fs: false,
      path: false,
    };

    return config;
  },
};

module.exports = nextConfig;
