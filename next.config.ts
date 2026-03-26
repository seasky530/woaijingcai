/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 TypeScript 配置: 打包时无视类型报错
  typescript: {
    ignoreBuildErrors: true,
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
  // ✅ 增加分类页面 301 重定向：旧短链接 /nba 等 -> 新路径 /category/nba
  async redirects() {
    return [
      // ✅ 处理 /home 和 /home/ 两种形式，统一 301 重定向到首页
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home/:path*',
        destination: '/',
        permanent: true,
      },
      // ✅ 处理 WordPress 残留的死链（明确路径配置，避免通配符报错）
      {
        source: '/wp-admin/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: true,
      },
      // ✅ 修复 Google Search Console 404 死链
      {
        source: '/post/cG9zdDozMTcw',
        destination: '/',
        permanent: true,
      },
      {
        source: '/monaco-vs-psg-prediction-ucl-20260218/',
        destination: '/post/monaco-vs-psg-prediction-ucl-20260218',
        permanent: true,
      },
      // 🏀 NBA 篮球
      {
        source: '/nba',
        destination: '/category/nba',
        permanent: true,
      },
      // ⚽ 足球世界杯
      {
        source: '/worldcup',
        destination: '/category/worldcup',
        permanent: true,
      },
      // ⚽ 欧冠
      {
        source: '/champions-league',
        destination: '/category/champions-league',
        permanent: true,
      },
      // ⚽ 英超
      {
        source: '/premier-league',
        destination: '/category/premier-league',
        permanent: true,
      },
      // 🏀 CBA
      {
        source: '/cba',
        destination: '/category/cba',
        permanent: true,
      },
      // 🏆 中超
      {
        source: '/csl',
        destination: '/category/csl',
        permanent: true,
      },
      // ⚽ 西甲
      {
        source: '/laliga',
        destination: '/category/laliga',
        permanent: true,
      },
      // ⚽ 意甲
      {
        source: '/serie-a',
        destination: '/category/serie-a',
        permanent: true,
      },
      // ⚽ 德甲
      {
        source: '/bundesliga',
        destination: '/category/bundesliga',
        permanent: true,
      },
      // 🏈 美式足球 NFL
      {
        source: '/nfl',
        destination: '/category/nfl',
        permanent: true,
      },
      // 🎾 网球
      {
        source: '/tennis',
        destination: '/category/tennis',
        permanent: true,
      },
      // 🏆 综合体育
      {
        source: '/sports',
        destination: '/category/sports',
        permanent: true,
      },
      // ⚡ 如需添加更多分类，请按照上面格式继续添加
    ];
  },
};

module.exports = nextConfig;