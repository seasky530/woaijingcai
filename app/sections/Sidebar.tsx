"use client";

import { Flame, Trophy, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const hotTopics = [
    { name: '英超预测', count: 1256 },
    { name: 'NBA前瞻', count: 987 },
    { name: '欧冠', count: 876 },
    { name: '盘口分析', count: 765 },
    { name: '赛事推荐', count: 654 },
    { name: '西甲', count: 543 },
    { name: '世界杯', count: 432 },
    { name: '亚盘', count: 321 },
  ];

  const hotMatches = [
    { id: 1, league: '欧冠', team1: '曼城', team2: '皇家马德里', time: '明天 03:00' },
    { id: 2, league: 'NBA', team1: '湖人', team2: '掘金', time: '今天 10:00' },
    { id: 3, league: '英超', team1: '阿森纳', team2: '拜仁慕尼黑', time: '明天 03:00' },
    { id: 4, league: '意甲', team1: '国际米兰', team2: 'AC米兰', time: '周日 02:45' },
    { id: 5, league: '西甲', team1: '巴塞罗那', team2: '马德里竞技', time: '周一 03:00' },
  ];

  return (
    <aside className="space-y-6 sticky top-24">
      {/* 热门话题区块 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">热门标签</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {hotTopics.map((topic) => (
            <Link
              key={topic.name}
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span className="font-medium">{topic.name}</span>
              <span className="text-[10px] text-gray-400">{topic.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 焦点赛事区块 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">焦点赛事</h3>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-red-600 flex items-center">
            更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-5">
          {hotMatches.map((match, index) => (
            <div key={match.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold w-4 text-center ${index < 3 ? 'text-red-500' : 'text-gray-400'}`}>
                  {index + 1}
                </span>
                <div>
                  <div className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {match.team1} vs {match.team2}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {match.league} · {match.time}
                  </div>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 新增：预留的高级广告位 */}
      <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-1 overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 flex flex-col items-center text-center">
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded-sm">
            赞助商广告
          </span>
          
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
          
          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
            在此处投放您的广告
          </h4>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            精准触达海量高净值体育用户群体，获取海量优质流量。现在联系我们获取独家报价方案。
          </p>
          
          <button className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            商务合作咨询
          </button>
        </div>
      </div>

    </aside>
  );
}