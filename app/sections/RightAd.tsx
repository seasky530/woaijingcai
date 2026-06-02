"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdItem {
  id: number;
  image: string;
  title: string;
  link: string;
}

const rightAds: AdItem[] = [
  {
    id: 1,
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/世博竖版-scaled.png',
    title: '世博国际',
    link: 'https://hiebs.com/?ch=dIKId7/#/home',
  },
  {
    id: 2,
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/J9竖版-scaled.png',
    title: 'J9',
    link: 'https://www.j9u10.com',
  },
  {
    id: 3,
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/w88竖版-scaled.png',
    title: 'W88',
    link: 'https://www.w88ww6.com/?affiliateid=156754',
  },
];

export default function RightAd() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAd = () => {
    setCurrentIndex((prev) => (prev + 1) % rightAds.length);
  };

  const prevAd = () => {
    setCurrentIndex((prev) => (prev - 1 + rightAds.length) % rightAds.length);
  };

  // 自动轮播：每 5 秒切换一次
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rightAds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:block">
      {/* Desktop Fixed Ad */}
      <div className="fixed right-4 top-24 z-40 hidden xl:block">
        <div className="relative">
          {/* Ad Container — 与主轮播图同高 */}
          <div className="w-[200px] h-[500px]">
            {/* Ad Content */}
            <div className="relative h-full">
              <a
                href={rightAds[currentIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <img
                  src={rightAds[currentIndex].image}
                  alt={rightAds[currentIndex].title}
                  className="w-full h-full object-cover"
                />
              </a>

              {/* Navigation Arrows */}
              {rightAds.length > 1 && (
                <>
                  <button
                    onClick={prevAd}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextAd}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Dots Indicator — 去掉背景色 */}
            {rightAds.length > 1 && (
              <div className="flex justify-center gap-1.5 py-2">
                {rightAds.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-4 bg-red-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Ad — Inline 横幅 */}
      <div className="xl:hidden bg-black rounded-lg overflow-hidden">
        <div className="relative">
          <a
            href={rightAds[currentIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={rightAds[currentIndex].image}
              alt={rightAds[currentIndex].title}
              className="w-full h-auto object-contain"
            />
          </a>

          {/* Mobile Navigation */}
          {rightAds.length > 1 && (
            <>
              <button
                onClick={prevAd}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextAd}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 right-2 flex gap-1">
                {rightAds.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
