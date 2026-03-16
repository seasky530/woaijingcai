"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdItem {
  id: number;
  image: string;
  title: string;
  link: string;
}

const leftAds: AdItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=600&fit=crop',
    title: '专业运动装备',
    link: '#',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&h=600&fit=crop',
    title: '健身会员特惠',
    link: '#',
  },
];

export default function LeftAd() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const nextAd = () => {
    setCurrentIndex((prev) => (prev + 1) % leftAds.length);
  };

  const prevAd = () => {
    setCurrentIndex((prev) => (prev - 1 + leftAds.length) % leftAds.length);
  };

  // Desktop collapsed state
  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded-r-xl shadow-lg hover:from-red-700 hover:to-red-800 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Fixed Ad */}
      <div className="fixed left-4 top-24 z-40 hidden xl:block">
        <div className="relative">
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-r-lg flex items-center justify-center hover:from-red-700 hover:to-red-800 transition-all z-10 shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Ad Container */}
          <div className="w-[160px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Ad Label */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 text-xs text-gray-500 text-center border-b border-gray-100 font-medium">
              广告
            </div>

            {/* Ad Content */}
            <div className="relative">
              <a href={leftAds[currentIndex].link} className="block">
                <img
                  src={leftAds[currentIndex].image}
                  alt={leftAds[currentIndex].title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                  <p className="text-white text-sm font-semibold">{leftAds[currentIndex].title}</p>
                </div>
              </a>

              {/* Navigation Arrows */}
              {leftAds.length > 1 && (
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

            {/* Dots Indicator */}
            {leftAds.length > 1 && (
              <div className="flex justify-center gap-1.5 py-3 bg-gray-50">
                {leftAds.map((_, index) => (
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

      {/* Mobile Ad - Inline */}
      <div className="xl:hidden mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 text-xs text-gray-500 font-medium flex items-center justify-between">
            <span>广告</span>
          </div>
          <div className="relative">
            <a href={leftAds[currentIndex].link} className="block">
              <img
                src={leftAds[currentIndex].image}
                alt={leftAds[currentIndex].title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold">{leftAds[currentIndex].title}</p>
              </div>
            </a>
            
            {/* Mobile Navigation */}
            {leftAds.length > 1 && (
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
                  {leftAds.map((_, index) => (
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
    </>
  );
}
