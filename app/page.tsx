import Navbar from './sections/Navbar';
import HeroCarousel from './sections/HeroCarousel';
import NewsSection from './sections/NewsSection';
import Sidebar from './sections/Sidebar';
import Footer from './sections/Footer';
import LeftAd from './sections/LeftAd';
import RightAd from './sections/RightAd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '我爱竞彩 | 全球顶级体育赛事预测与盘口分析',
  description: '专注2026世界杯、NBA、欧洲五大联赛等顶级赛事的深度前瞻、战术解密与实力盘口分析，助您掌握赛场先机。',
  keywords: ['足球预测', 'NBA预测', '世界杯分析', '盘口分析', '体育资讯', '赛前前瞻'],
};
// 1. 升级版数据引擎：向 WordPress 索要完整的数据包！
async function getLatestMatches() {
  try {
    const res = await fetch('https://api.woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetPosts {
            posts(first: 200) {
              nodes {
                id
                slug
                title
                excerpt
                date
                categories {
                  nodes {
                    name
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
              }
            }
          }
        `
      }),
      next: { revalidate: 60 } 
    });
    const json = await res.json();
    const wpPosts = json.data?.posts?.nodes || [];

    // 2. 核心魔法：把 WordPress 的生肉数据，精细加工成 Kimi 卡片需要的熟肉！
    return wpPosts.map((post: any) => {
      // 帮摘要脱掉 HTML 外衣 (WP 默认会带 <p> 标签)
      const cleanExcerpt = post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '') : '暂无摘要...';
      // 提取所有分类名数组，用于过滤
      const categoryNames = post.categories?.nodes?.map((cat: any) => cat.name) || ['综合'];
      // 提取主分类（取第一个用于显示）
      const categoryName = categoryNames[0];
      // 提取封面图，如果你某篇文章忘配图了，就用一张默认的酷炫体育图保底
      const imageUrl = post.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&h=300&fit=crop';
      // 把英文时间转换成年月日
      const publishDate = new Date(post.date).toLocaleDateString('zh-CN');

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        summary: cleanExcerpt,
        category: categoryName,
        categories: categoryNames,
        image: imageUrl,
        date: post.date,
        publishTime: publishDate,
        // 下面这些互动数据你的 WP 暂时没有，我们先随机生成一些假的让排版好看
        author: '本站专栏',
        views: Math.floor(Math.random() * 50000) + 10000, 
        comments: Math.floor(Math.random() * 500) + 10,
        isHot: true 
      };
    });

  } catch (error) {
    console.error("获取文章失败:", error);
    return [];
  }
}

export default async function Home() {
  // 在服务器端拿到完美加工后的文章
  const posts = await getLatestMatches();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="sr-only">我爱竞彩 - 全球顶级体育赛事预测与比分分析平台</h1>
        <HeroCarousel posts={posts} />
        <div className="xl:hidden mt-6 mb-4">
          <LeftAd />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {/* 把加工好的完美数据送给列表！ */}
            <NewsSection posts={posts} />
          </div>
          <div className="lg:col-span-1 space-y-5">
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            <div className="lg:hidden">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
