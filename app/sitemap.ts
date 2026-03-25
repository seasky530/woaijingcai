import { MetadataRoute } from 'next';

// ✅ 站点地图配置 - 确保所有 URL 格式统一（不带斜杠结尾）
// 这与 next.config.ts 中的 trailingSlash: false 保持一致
const SITE_URL = 'https://woaijingc.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 静态路由（首页）- 不带斜杠结尾
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  try {
    // 2. 动态去你的 WordPress 拉取所有文章数据
    const res = await fetch('https://api.woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetAllPostsForSitemap {
            posts(first: 1000) {
              nodes {
                databaseId
                slug
                modified
              }
            }
          }
        `,
      }),
      // 这里设置地图每 1 小时更新一次缓存，既快又不伤服务器
      next: { revalidate: 3600 }, 
    });

    const { data } = await res.json();

    // 3. ✅ 获取所有分类（用于生成分类页面的 sitemap 条目）
    const categoriesRes = await fetch('https://api.woaijingc.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetAllCategories {
            categories(first: 100) {
              nodes {
                slug
                name
              }
            }
          }
        `,
      }),
      next: { revalidate: 3600 },
    });

    const categoriesData = await categoriesRes.json();

    // 4. ✅ 生成分类页面的路由 - URL 格式：{SITE_URL}/category/{slug}
    const categoryRoutes = categoriesData.data?.categories?.nodes?.map((category: any) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })) || [];

    // 5. ✅ 生成文章页面的路由 - URL 格式：{SITE_URL}/post/{slug} （不带斜杠结尾）
    const postRoutes = data.posts.nodes.map((post: any) => ({
      url: `${SITE_URL}/post/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...postRoutes];
  } catch (error) {
    console.error('Sitemap 生成失败:', error);
    // 就算报错了，至少也要把首页交出去
    return staticRoutes;
  }
}