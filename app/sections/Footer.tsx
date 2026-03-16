import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        
        {/* 极简 Logo */}
        <Link href="/" className="flex items-center gap-2 mb-3 group inline-flex hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center shadow-sm">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tight">
            我爱竞彩
          </span>
        </Link>
        
        {/* 纯粹的版权声明 */}
        <p className="text-xs text-gray-400">
          © 2026 我爱竞彩 (woaijingc.com). All rights reserved.
        </p>
        
      </div>
    </footer>
  );
}