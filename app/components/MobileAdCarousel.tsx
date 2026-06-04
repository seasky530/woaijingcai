'use client';

import { useState, useEffect } from 'react';

interface AdItem {
  id: number;
  image: string;
  link: string;
}

const ads: AdItem[] = [
  {
    id: 1,
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/世博横版-scaled.png',
    link: 'https://hiebs.com/?ch=dIKId7/#/home',
  },
  {
    id: 2,
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/j9横版-scaled.png',
    link: 'https://www.j9u10.com',
  },
  {
    id: 3,
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/W88横版-scaled.png',
    link: 'https://www.w88ww6.com/?affiliateid=156754',
  },
];

export default function MobileAdCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-900">
      <a
        href={ads[currentIndex].link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
      >
        <img
          src={ads[currentIndex].image}
          alt={`广告 ${ads[currentIndex].id}`}
          className="w-full h-auto object-contain"
        />
        <span className="pointer-events-none absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded shadow-lg">
          点击加入
        </span>
      </a>

      {/* 底部小圆点指示器 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
            }`}
            aria-label={`切换到第 ${index + 1} 张广告`}
          />
        ))}
      </div>
    </div>
  );
}
