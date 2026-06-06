import Navbar from '@/app/sections/Navbar';
import Footer from '@/app/sections/Footer';
import Sidebar from '@/app/sections/Sidebar';
import Pagination from '@/app/components/Pagination';
import Link from 'next/link';
import { Metadata } from 'next';

const PAGE_SIZE = 12;

// 1. 向 WordPress 发送 GraphQL 请求，精准拿取特定分类下的文章（支持分页）
async function getCategoryPosts(slug: string, page: number = 1) {
  // 多查1条用于判断是否有下一页
  const first = page * PAGE_SIZE + 1;
  try {
    const res = await fetch('https://api.woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetCategoryPosts($id: ID!, $first: Int!) {
            category(id: $id, idType: SLUG) {
              name
              description
              seo {
                title
                metaDesc
              }
              posts(first: $first) {
                nodes {
                  id
                  slug
                  title
                  excerpt
                  date
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
          }
        `,
        variables: { id: slug, first }
      }),
      next: { revalidate: 60 }
    });
    const json = await res.json();
    console.log(`[分类 ${slug} GraphQL 响应]`, JSON.stringify(json, null, 2));

    if (json.errors) {
      console.error(`[分类 ${slug} GraphQL 错误]`, json.errors);
    }

    return json.data?.category;
  } catch (error) {
    console.error("[分类页 fetch 异常]", error);
    return null;
  }
}

// 2. ✅ SEO 引擎：为每个分类页生成独立的 metadata 和 canonical URL
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const category = await getCategoryPosts(decodedSlug);

  if (!category) {
    return {
      title: '分类未找到 | 我爱竞彩',
      alternates: {
        canonical: 'https://woaijingc.com/',
      },
    };
  }

  // ✅ 生成精确的 canonical URL，格式：https://woaijingc.com/category/{slug}
  const canonicalUrl = `https://woaijingc.com/category/${resolvedParams.slug}`;

  // 优先使用 Yoast SEO 的数据，如果没有则使用 WordPress 默认描述或自动生成
  const seoTitle = category.seo?.title || `${category.name}赛事预测与分析 | 我爱竞彩`;
  const seoDescription = category.seo?.metaDesc
    || (category.description ? category.description.replace(/<[^>]*>/g, '').trim() : '')
    || `最新最全的${category.name}赛事前瞻、盘口分析与高阶数据解读。`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// 3. 分类页主界面渲染
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);

  const category = await getCategoryPosts(decodedSlug, page);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800">该分类下暂无文章</h2>
          <Link href="/" className="mt-4 text-red-600 hover:underline">返回首页</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const posts = category.posts.nodes;

  // 服务端切片：只取当前页应显示的条目
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  const hasNextPage = posts.length > end;
  const displayPosts = posts.slice(start, end);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 border-l-4 border-red-600 pl-4">
            {category.name} 资讯专区
          </h1>
          {/* 显示 Yoast SEO 的 metaDesc 或 WordPress 默认描述 */}
          {(category.seo?.metaDesc || category.description) && (
            <p
              className="mt-3 text-gray-600 text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: category.seo?.metaDesc || category.description
              }}
            />
          )}
          <p className="mt-3 text-gray-500 text-sm">共找到 {displayPosts.length} 篇最新分析</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* 左侧文章列表 */}
          <div className="xl:w-[70%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayPosts.map((post: any) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
                    {post.matchInfo?.matchTime && (
                      <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                        开赛时间 {post.matchInfo.matchTime.replace('T', ' ').substring(5, 16)}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h2>
                    <div className="mt-auto flex items-center text-xs text-gray-500">
                      <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md font-medium">
                        {category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={page}
              hasNextPage={hasNextPage}
              basePath={`/category/${resolvedParams.slug}`}
            />
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
