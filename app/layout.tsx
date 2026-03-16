import './globals.css';
import type { Metadata } from 'next';
// 🔥 引入两侧广告组件
import LeftAd from './sections/LeftAd';
import RightAd from './sections/RightAd';

// 这里的全局 SEO 也顺手帮你改成了你的品牌名
export const metadata: Metadata = {
  title: '我爱竞彩 | 顶级体育赛事预测与盘口分析',
  description: '专注2026世界杯、NBA、欧洲五大联赛等顶级赛事的深度前瞻、战术解密与实力盘口分析，助您掌握赛场先机。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      {/* 加上 relative 确保子元素的绝对定位不会跑偏 */}
      <body className="antialiased relative">
        
        {/* 🔥 全局悬浮广告：只要屏幕够宽 (xl:block)，就在所有页面显示！ */}
        <div className="hidden xl:block">
          <LeftAd />
          <RightAd />
        </div>

        {/* 具体的页面内容 */}
        {children}
        
      </body>
    </html>
  );
}