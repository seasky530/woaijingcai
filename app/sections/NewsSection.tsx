"use client";

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, Eye, MessageCircle } from 'lucide-react';

export default function NewsSection({ posts }: { posts: any[] }) {
  const [activeTab, setActiveTab] = useState('全部');
  const tabs = ['全部', '英超', 'NBA', '德甲', '法甲', '西甲', '意甲', '世界杯'];

  // 🔥 极其强悍的过滤引擎：兼容任何被 Kimi 改乱的数据结构！
  const filteredPosts = posts.filter(post => {
    if (activeTab === '全部') return true;

    let categoryNames: string[] = [];

    // 智能识别 WordPress 原始结构 或 Kimi 修改后的结构
    if (post.categories?.nodes) {
      categoryNames = post.categories.nodes.map((node: any) => node.name);
    } else if (Array.isArray(post.categories)) {
      categoryNames = post.categories.map((c: any) => typeof c === 'string' ? c : c.name);
    } else if (post.category) {
      categoryNames = [typeof post.category === 'string' ? post.category : post.category.name];
    }

    // 只要文章包含了这个标签，就显示出来！
    return categoryNames.includes(activeTab);
  });

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

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-105'
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredPosts.slice(0, 6).map((post: any) => {
            // 兼容抓取分类名和图片
            const catName = post.categories?.nodes?.[0]?.name || 
                           (Array.isArray(post.categories) ? (typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0]?.name) : null) || 
                           post.category || '综合';
            const imgUrl = post.featuredImage?.node?.sourceUrl || post.image || '';

            return (
              <Link key={post.id || post.slug} href={`/post/${post.id || post.slug}`} className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
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
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-4">
                    {post.excerpt ? post.excerpt.replace(/<[^>]+>/g, '') : '深度赛事前瞻与战术分析'}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.date ? new Date(post.date).toLocaleDateString('zh-CN') : '近期'}</span>
                    </div>
                  </div>
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