import Navbar from '@/app/sections/Navbar';
import Footer from '@/app/sections/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

// 1. 去 WordPress 调取单篇文章完整正文的接口
async function getPost(slug: string) {
  try {
    const res = await fetch('https://api.woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetPost($id: ID!) {
            post(id: $id, idType: SLUG) {
              title
              content
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
        `,
        variables: { id: slug }
      }),
      next: { revalidate: 60 }
    });
    const json = await res.json();
    return json.data?.post;
  } catch (error) {
    console.error("获取文章失败:", error);
    return null;
  }
}

// 2. 🔥 万能兼容版 SEO 引擎：强制写入真实标题！
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // 兼容不同版本的 Next.js 参数读取
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return { title: '赛事分析 | S SPORTS' };
  }

  // 帮摘要脱掉 HTML 外衣，做成完美的 SEO 描述
  const cleanDescription = post.excerpt 
    ? post.excerpt.replace(/<[^>]+>/g, '').substring(0, 150) 
    : '深度赛事前瞻与盘口分析';

  return {
    title: `${post.title} | S SPORTS`,
    description: cleanDescription,
  };
}

// 3. 详情页主组件
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // 同样兼容处理参数
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  // 如果文章不存在的兜底页面
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">404 - 文章找不到了</h2>
        <Link href="/" className="mt-4 text-red-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  // 处理数据
  const publishDate = new Date(post.date).toLocaleDateString('zh-CN');
  const categoryName = post.categories?.nodes?.[0]?.name || '综合';
  const imageUrl = post.featuredImage?.node?.sourceUrl;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors mb-6 inline-flex items-center gap-2">
          &larr; 返回资讯大厅
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          {imageUrl && (
            <div className="w-full h-64 sm:h-80 md:h-[400px] relative">
              <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">{categoryName}</span>
              <span>{publishDate}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div 
              className="text-gray-700 text-lg leading-relaxed space-y-6 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>img]:rounded-xl [&>img]:my-6"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}