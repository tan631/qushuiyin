'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  const t = useTranslations('history');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/api/extract/history')
      .then(res => res.json())
      .then(data => setHistory(data.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
            退出登录
          </button>
        </div>

        <div className="space-y-4">
          {history.map((item: any) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="font-semibold">{item.platform}</p>
              <p className="text-sm truncate">{item.originalUrl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
