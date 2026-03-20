"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// 默认的假数据（如果你的后台还没文章，就用这个保底）
const fallbackItems = [
  {
    id: 'fallback-1',
    slug: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&h=500&fit=crop',
    title: '欧冠决赛：皇马vs曼城巅峰对决',
    subtitle: '两支豪门球队将在伊斯坦布尔争夺欧洲最高荣誉',
    category: '足球'
  }
];

export default function HeroCarousel({ posts = [] }: { posts?: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔥 核心魔法：把传进来的真实文章，精选前 3 篇作为焦点图！
  const carouselItems = posts.length > 0 
    ? posts.slice(0, 3).map(post => ({
        id: post.id,
        slug: post.slug,
        image: post.image,
        title: post.title,
        // 把摘要当做副标题，如果没有摘要就写一句引导点击的话
        subtitle: post.summary || '点击阅读详细的赛事预测与盘口分析...',
        category: post.category
      }))
    : fallbackItems;

  // 自动轮播定时器
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  if (!carouselItems || carouselItems.length === 0) return null;

  return (
    <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden group">
      {/* 轮播图片列表 */}
      {carouselItems.map((item, index) => (
        <Link
          href={`/post/${item.slug}`}
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* 文字内容区 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white bg-red-600 rounded-full shadow-lg">
              {item.category}
            </span>
            <div className="group/link">
              <h1 className="mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight group-hover/link:text-red-400 transition-colors drop-shadow-lg">
                {item.title}
              </h1>
              <p className="hidden sm:block text-gray-200 text-sm sm:text-base max-w-2xl line-clamp-2 drop-shadow-md">
                {item.subtitle}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* 左右切换按钮 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 底部小圆点（动态计算数量） */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'w-6 bg-red-600' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
