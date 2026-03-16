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
};

module.exports = nextConfig;