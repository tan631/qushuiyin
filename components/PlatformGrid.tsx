'use client';

import { useTranslations } from 'next-intl';

const platforms = [
  { name: 'tiktok',    icon: '📱', label: 'TikTok' },
  { name: 'youtube',   icon: '▶️', label: 'YouTube' },
  { name: 'twitter',   icon: '🐦', label: 'Twitter/X' },
  { name: 'bilibili',  icon: '📺', label: 'B站' },
  { name: 'instagram', icon: '📸', label: 'Instagram' },
  { name: 'douyin',    icon: '🎵', label: '抖音' },
];

export default function PlatformGrid() {
  return (
    <section className="border-t border-white/6 py-14">
      <p className="text-center text-xs text-white/30 tracking-widest mb-7 uppercase">
        Supported Platforms
      </p>
      <div className="flex justify-center flex-wrap gap-3">
        {platforms.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2.5 bg-white/5 border border-white/8 hover:border-[#7c6fff]/40 hover:bg-[#7c6fff]/8 rounded-xl px-5 py-3 transition cursor-default"
          >
            <span className="text-2xl">{p.icon}</span>
            <span className="text-sm font-medium">{p.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
