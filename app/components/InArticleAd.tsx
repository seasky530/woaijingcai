'use client';

interface InArticleAdProps {
  index?: number;
}

const ads = [
  {
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/sb文章内置图-scaled.png',
    link: 'https://hiebs.com/?ch=dIKId7/#/home',
  },
  {
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/W88文章内置图-1-scaled.png',
    link: 'https://www.w88ww6.com/?affiliateid=156754',
  },
  {
    image: 'https://api.woaijingc.com/wp-content/uploads/2026/06/J9文章内置图-scaled.png',
    link: 'https://www.j9u10.com',
  },
];

export default function InArticleAd({ index = 0 }: InArticleAdProps) {
  const ad = ads[index] || ads[0];

  return (
    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="relative block w-full my-6">
      <img
        src={ad.image}
        alt="广告"
        className="w-full h-auto object-contain"
      />
      <span className="pointer-events-none absolute bottom-1 right-1 bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold rounded shadow-lg md:bottom-2 md:right-2 md:px-3 md:py-1 md:text-sm">
        点击加入
      </span>
    </a>
  );
}
