"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

/** 从 matchTime 提取展示用的 MM-DD 和用于比较的 Date 对象 */
function parseMatchDate(matchTime: string | undefined | null): { label: string; dateObj: Date } | null {
  if (!matchTime) return null;
  const date = new Date(matchTime);
  if (isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return { label: `${month}-${day}`, dateObj: date };
}

export default function NewsSection({ posts }: { posts: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string>('全部');

  /*
   * 日期 Tab 数据来源说明：
   * 当前 dateOptions 是从「当前页传入的 posts」中提取 matchTime 并去重生成的。
   * 因此如果后端分页没有把未来几天的文章全部返回，Tab 上就不会显示那些日期。
   *
   * 如果想让 Tab 固定展示未来 N 天的完整日期列表（无论当前页有没有对应文章），
   * 需要后端接口提供一个独立的聚合端点（例如返回未来 7 天所有有赛程的日期），
   * 前端再把这个聚合数据与当前页的文章列表做关联。
   *
   * 目前阶段：保持「基于当前页数据提取」的逻辑，仅过滤掉过期日期即可。
   */
  const dateOptions = useMemo(() => {
    // 今天 00:00（本地时间），用于过滤过期日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateMap = new Map<string, Date>();

    posts.forEach((post) => {
      const parsed = parseMatchDate(post.matchTime);
      if (parsed && parsed.dateObj >= today) {
        dateMap.set(parsed.label, parsed.dateObj);
      }
    });

    // 按时间先后排序
    const sortedLabels = Array.from(dateMap.entries())
      .sort((a, b) => a[1].getTime() - b[1].getTime())
      .map(([label]) => label);

    return ['全部', ...sortedLabels];
  }, [posts]);

  // 根据选中日期过滤文章
  const filteredPosts = useMemo(() => {
    if (selectedDate === '全部') return posts;
    return posts.filter((post) => parseMatchDate(post.matchTime)?.label === selectedDate);
  }, [posts, selectedDate]);

  return (
    <section className="mb-12">
      {/* 标题区 + 日期筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">最新分析</h2>
            <p className="text-gray-500 text-sm mt-1">实时更新全球体育动态</p>
          </div>
        </div>

        {/* 日期 Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {dateOptions.map((date) => {
            const isActive = selectedDate === date;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`
                  whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }
                `}
              >
                {date === '全部' ? '全部' : `${date} 赛事`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 文章列表 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post: any) => {
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
                      开赛时间 {post.matchTime.replace('T', ' ').substring(5, 16)}
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
           <p className="text-gray-500 font-medium">该日期下暂无最新分析</p>
         </div>
      )}
    </section>
  );
}
