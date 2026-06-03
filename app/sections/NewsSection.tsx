"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

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

/**
 * 判断 matchTime 是否包含目标日期
 * 支持多种格式：YYYY-MM-DD、YYYY-M-D、MM-DD、M-D、MM/DD、M/D
 */
function dateMatches(targetLabel: string, matchTime: string | undefined | null): boolean {
  if (!matchTime) return false;

  // 1. 清理 targetLabel 中的中文字符，提取核心日期（如 '06-03 赛事' → '06-03'）
  const targetClean = targetLabel.replace(/[^\d\-/]/g, '');
  const targetParsed = targetClean.match(/^(\d{1,2})[-/](\d{1,2})$/);
  if (!targetParsed) return false;

  const targetMonth = parseInt(targetParsed[1], 10);
  const targetDay = parseInt(targetParsed[2], 10);

  // 2. 优先从 matchTime 中提取 YYYY-MM-DD 或 YYYY-M-D 格式的月份和日期
  const isoMatch = matchTime.match(/\d{4}[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const month = parseInt(isoMatch[1], 10);
    const day = parseInt(isoMatch[2], 10);
    if (month === targetMonth && day === targetDay) return true;
  }

  // 3. 兜底：字符串包含检查，覆盖补零和不补零、横杠和斜杠等变体
  const patterns = [
    `${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`,
    `${targetMonth}-${targetDay}`,
    `${String(targetMonth).padStart(2, '0')}/${String(targetDay).padStart(2, '0')}`,
    `${targetMonth}/${targetDay}`,
  ];

  return patterns.some((p) => matchTime.includes(p));
}

export default function NewsSection({ posts }: { posts: any[] }) {
  const [selectedDate, setSelectedDate] = useState<string>('全部');

  // Tab 固定展示：全部 + 今天/明天/后天
  const dateOptions = useMemo(() => {
    return ['全部', ...getNextThreeDays()];
  }, []);

  // 根据选中日期过滤文章
  const filteredPosts = useMemo(() => {
    if (selectedDate === '全部') return posts;
    return posts.filter((post) => dateMatches(selectedDate, post.matchTime));
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
