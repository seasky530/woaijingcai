import Navbar from '@/app/sections/Navbar';
import Footer from '@/app/sections/Footer';
import Sidebar from '@/app/sections/Sidebar';
import Link from 'next/link';
import { Metadata } from 'next';

// 1. 向 WordPress 发送 GraphQL 请求，精准拿取特定分类下的文章
async function getCategoryPosts(slug: string) {
  try {
    const res = await fetch('https://woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetCategoryPosts($id: ID!) {
            category(id: $id, idType: SLUG) {
              name
              posts(first: 20) {
                nodes {
                  id
                  title
                  excerpt
                  date
                  featuredImage {
                    node {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { id: slug }
      }),
      cache: 'no-store'
    });
    const json = await res.json();
    return json.data?.category;
  } catch (error) {
    console.error("获取分类失败:", error);
    return null;
  }
}

// 2. 万能兼容 SEO 引擎（给每个分类页单独做 SEO）
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryPosts(resolvedParams.slug);

  if (!category) return { title: '分类未找到 | 我爱竞彩' };

  return {
    title: `${category.name}赛事预测与分析 | 我爱竞彩`,
    description: `最新最全的${category.name}赛事前瞻、盘口分析与高阶数据解读。`,
  };
}

// 3. 分类页主界面渲染
export default async function CategoryPage({ params }: any) {
  const resolvedParams = await params;
  const category = await getCategoryPosts(resolvedParams.slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800">该分类下暂无文章</h1>
          <Link href="/" className="mt-4 text-red-600 hover:underline">返回首页</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const posts = category.posts.nodes;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 border-l-4 border-red-600 pl-4">
            {category.name} 资讯专区
          </h1>
          <p className="mt-2 text-gray-500">共找到 {posts.length} 篇最新分析</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* 左侧文章列表 */}
          <div className="xl:w-[70%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/post/${post.id}`} className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-100">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img 
                        src={post.featuredImage.node.sourceUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h2>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md font-medium">
                        {category.name}
                      </span>
                      <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="xl:w-[30%]">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}