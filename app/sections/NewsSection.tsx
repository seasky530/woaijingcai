"use client";

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export default function NewsSection({ posts }: { posts: any[] }) {
  return (
    <section className="mb-12">
      {/* 标题区 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">最新分析</h2>
          <p className="text-gray-500 text-sm mt-1">实时更新全球体育动态</p>
        </div>
      </div>

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map((post: any) => {
            // 兼容抓取分类名和图片
            const catName = post.categories?.nodes?.[0]?.name || 
                           (Array.isArray(post.categories) ? (typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0]?.name) : null) || 
                           post.category || '综合';
            const imgUrl = post.featuredImage?.node?.sourceUrl || post.image || '';

            return (
              <Link key={post.id || post.slug} href={`/post/${post.slug}`} className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-100">
                  {imgUrl ? (
                    <img src={imgUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      {catName}
                    </span>
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 热门
                    </span>
                  </div>
                  {post.matchTime && (
                    <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                      开赛时间 {post.matchTime.substring(5, 16)}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>

                  <div className="mt-auto" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
         <div className="w-full py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 border-dashed">
           <p className="text-gray-500 font-medium">该分类下暂无最新分析</p>
         </div>
      )}
    </section>
  );
}