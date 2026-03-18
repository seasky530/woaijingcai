import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 如果你有不想被搜索引擎收录的页面（比如后台接口等），可以加在这里
      // disallow: '/private/', 
    },
    sitemap: 'https://woaijingc.com/sitemap.xml',
  };
}