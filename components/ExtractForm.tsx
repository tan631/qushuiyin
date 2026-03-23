'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ExtractForm() {
  const t = useTranslations('home');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-16">
      <div className="flex gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '...' : t('extract')}
        </button>
      </div>
    </form>
  );
}
