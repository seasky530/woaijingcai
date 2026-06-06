"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 12;

/** 基于客户端本地时间，生成今天、明天、后天连续 3 天的 MM-DD 数组 */
function getNextThreeDays(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${month}-${day}`);
  }
  return dates;
}

export default function NewsSection({ posts }: { posts: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string>('全部');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Tab 固定展示：全部 + 今天/明天/后天
  const dateOptions = useMemo(() => {
    return ['全部', ...getNextThreeDays()];
  }, []);

  // 1. 先根据选中日期过滤文章
  const filteredPosts = useMemo(() => {
    if (selectedDate === '全部') return posts;
    const targetDate = selectedDate.substring(0, 5);
    return posts.filter((post) => post.matchTime?.includes(targetDate));
  }, [posts, selectedDate]);

  // 2. 基于过滤后的总数计算总页数
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  }, [filteredPosts]);

  // 3. 切片出当前页要显示的文章
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPosts = useMemo(() => {
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // 防呆：切换日期 Tab 时立即重置到第 1 页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  // 安全修正：如果当前页码超出总页数，自动归位
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
      {currentPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentPosts.map((post: any) => {
              // 兼容抓取分类名和图片
              const catName = post.categories?.nodes?.[0]?.name || 
                             (Array.isArray(post.categories) ? (typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0]?.name) : null) || 
                             post.category || '综合';
              const imgUrl = post.featuredImage?.node?.sourceUrl || post.image || '';

              return (
                <Link key={post.id || post.slug} href={`/post/${post.slug}`} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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

          {/* 内部分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </button>

              <span className="text-sm font-medium text-gray-600">
                第 {currentPage} / {totalPages} 页
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
         <div className="w-full py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 border-dashed">
           <p className="text-gray-500 font-medium">该日期下暂无最新分析</p>
         </div>
      )}
    </section>
  );
}
