"use client";

import { useState, useEffect } from 'react';
import { Search, Flame } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 引入路径监听器

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname(); // 获取当前所在的网址路径

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 这里的 path 就是你 WordPress 后台分类目录里的“别名(slug)”
  // 完美对接你后台的别名，并提前部署了 2026 世界杯的长线入口！
  const navLinks = [
    { name: '首页', path: '/' },
    { name: '世界杯', path: '/category/worldcup' }, 
    { name: '欧冠', path: '/category/champions-league' },
    { name: '英超', path: '/category/premier-league' },
    { name: '德甲', path: '/category/bundesliga' },
    { name: '法甲', path: '/category/ligue-1' },
    { name: '西甲', path: '/category/la-liga' },
    { name: '意甲', path: '/category/serie-a' },
    { name: '其他联赛', path: '/category/qita' },
    { name: 'NBA', path: '/category/nba' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          <div className="flex items-center gap-4 lg:gap-8 overflow-hidden">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 group-hover:text-red-600 transition-colors">
                我爱竞彩
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium overflow-x-auto hide-scrollbar">
              {navLinks.map((item) => {
                // 智能判断：如果当前网址等于这个按钮的路径，就高亮变红！
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    className={`px-3 py-2 rounded-full transition-colors whitespace-nowrap ${
                      isActive 
                        ? 'text-red-600 bg-red-50 font-bold' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:flex items-center flex-shrink-0 ml-4">
            <div className="relative group">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="搜索赛事前瞻..." 
                className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}