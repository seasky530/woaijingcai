/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 终极特权 1: 打包时无视所有 TypeScript 类型报错
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 🔥 终极特权 2: 打包时无视所有 ESLint 语法检查报错
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ SEO 优化: 统一 URL 格式，禁用斜杠结尾，避免重复内容问题
  // 使用 false 表示所有页面都不带斜杠，如 /post/hello 而非 /post/hello/
  trailingSlash: false,
  
  // 🖼️ 图片域名白名单: 允许 Next.js 优化并显示来自 WordPress 的图片
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

  // 🚀 终极特权 4: 彻底解决 /home 历史遗留问题，301 永久重定向到真首页
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;