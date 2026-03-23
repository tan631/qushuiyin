'use client';

import { useTranslations } from 'next-intl';

export default function PlatformGrid() {
  const t = useTranslations('platforms');

  const platforms = [
    { name: 'youtube', icon: '📺', support: '视频+文案' },
    { name: 'tiktok', icon: '🎵', support: '视频+文案' },
    { name: 'twitter', icon: '🐦', support: '视频+文案' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">支持平台</h2>
      <div className="grid grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <div key={platform.name} className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl mb-2">{platform.icon}</div>
            <h3 className="font-semibold mb-1">{t(platform.name)}</h3>
            <p className="text-sm text-gray-500">{platform.support}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
