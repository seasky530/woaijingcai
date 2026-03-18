/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 终极特权 1：打包时无视所有 TypeScript 类型报错
  typescript: {
    ignoreBuildErrors: true,
  },
  // 🔥 终极特权 2：打包时无视所有 ESLint 语法检查报错
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 🖼️ 图片域名白名单：允许 Next.js 优化并显示来自 WordPress 的图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.woaijingc.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;