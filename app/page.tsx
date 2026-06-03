import Navbar from './sections/Navbar';
import HeroCarousel from './sections/HeroCarousel';
import NewsSection from './sections/NewsSection';
import Sidebar from './sections/Sidebar';
import Footer from './sections/Footer';
import LeftAd from './sections/LeftAd';
import RightAd from './sections/RightAd';
import Pagination from './components/Pagination';
import MobileAdCarousel from './components/MobileAdCarousel';
import type { Metadata } from 'next';

const PAGE_SIZE = 12;

// ✅ 首页 SEO 配置 - 必须明确设置 canonical URL，避免被搜索引擎视为重复内容
export const metadata: Metadata = {
  title: '我爱竞彩 | 全球顶级体育赛事预测与盘口分析',
  description: '专注2026世界杯、NBA、欧洲五大联赛等顶级赛事的深度前瞻、战术解密与实力盘口分析，助您掌握赛场先机。',
  keywords: ['足球预测', 'NBA预测', '世界杯分析', '盘口分析', '体育资讯', '赛前前瞻'],
  // ✅ 首页 canonical URL - 使用绝对路径 https://woaijingc.com/
  alternates: {
    canonical: 'https://woaijingc.com/',
  },
};

// 1. 数据引擎：根据页码向 WordPress 索要数据，在服务端切片分页
async function getLatestMatches(page: number = 1) {
  // 调大拉取数量，确保首页能覆盖未来几天的比赛文章
  // 分页逻辑仍保留：按页码切片，但底层至少拉 50 条
  const first = Math.max(50, page * PAGE_SIZE + 1);
  try {
    const res = await fetch('https://api.woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetPosts($first: Int!) {
            posts(first: $first) {
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
                matchInfo {
                  matchTime
                }
              }
            }
          }
        `,
        variables: { first }
      }),
      cache: 'no-store'
    });
    const json = await res.json();
    console.log('[首页 GraphQL 响应]', JSON.stringify(json, null, 2));

    if (json.errors) {
      console.error('[首页 GraphQL 错误]', json.errors);
    }

    const wpPosts = json.data?.posts?.nodes || [];

    // 2. 把 WordPress 数据精细加工成卡片需要的数据
    return wpPosts.map((post: any) => {
      const cleanExcerpt = post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '') : '暂无摘要...';
      const categoryNames = post.categories?.nodes?.map((cat: any) => cat.name) || ['综合'];
      const categoryName = categoryNames[0];
      const imageUrl = post.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&h=300&fit=crop';
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
        matchTime: post.matchInfo?.matchTime,
        author: '本站专栏',
        views: Math.floor(Math.random() * 50000) + 10000,
        comments: Math.floor(Math.random() * 500) + 10,
        isHot: true
      };
    });

  } catch (error) {
    console.error("[首页 fetch 异常]", error);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);

  // 在服务器端拿到加工后的文章
  const posts = await getLatestMatches(page);

  // 服务端切片：只取当前页应显示的条目
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  const hasNextPage = posts.length > end;
  const displayPosts = posts.slice(start, end);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="sr-only">我爱竞彩 - 全球顶级体育赛事预测与盘口分析</h1>
        <HeroCarousel posts={displayPosts} />
        {/* 手机端横幅轮播广告位 */}
        <div className="block lg:hidden w-full my-4">
          <MobileAdCarousel />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {/* 把加工好的完美数据送给列表！ */}
            <NewsSection posts={displayPosts} />
            <Pagination currentPage={page} hasNextPage={hasNextPage} basePath="/" />
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
