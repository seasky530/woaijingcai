"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  basePath: string;
}

export default function Pagination({ currentPage, hasNextPage, basePath }: PaginationProps) {
  const prevHref = `${basePath}?page=${currentPage - 1}`;
  const nextHref = `${basePath}?page=${currentPage + 1}`;

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      {currentPage > 1 && (
        <Link
          href={prevHref}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          上一页
        </Link>
      )}

      {hasNextPage && (
        <Link
          href={nextHref}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm"
        >
          下一页
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
