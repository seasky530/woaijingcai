import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 静态路由（你的首页）
  const staticRoutes = [
    {
      url: 'https://woaijingc.com',
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

    // 3. 把每一篇文章组装成地图里的一个坐标
    // ⚠️ 注意：这里我用的是 /post/${post.databaseId}，请确保这和你的实际文章链接一致！
    // 如果你的文章链接是带英文/拼音的，请把 post.databaseId 改成 post.slug
    const dynamicRoutes = data.posts.nodes.map((post: any) => ({
      url: `https://woaijingc.com/post/${post.databaseId}`, 
      lastModified: new Date(post.modified),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Sitemap 生成失败:', error);
    // 就算报错了，至少也要把首页交出去
    return staticRoutes;
  }
}