'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface VideoResult {
  title: string;
  platform: string;
  duration?: string;
  author?: string;
  videoUrl?: string;
  textContent?: string;
  qualities: { label: string; value: string; url?: string }[];
}

const PLATFORM_EXAMPLES: Record<string, string> = {
  'TikTok': 'https://www.tiktok.com/@creator/video/123456',
  'YouTube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Twitter/X': 'https://twitter.com/user/status/123456',
};

const PLATFORM_TAGS = [
  { label: '📱 TikTok', key: 'TikTok' },
  { label: '▶️ YouTube', key: 'YouTube' },
  { label: '🐦 Twitter/X', key: 'Twitter/X' },
];

type ExtractType = 'video' | 'text' | 'both';

export default function ExtractForm() {
  const t = useTranslations('home');
  const tResult = useTranslations('result');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VideoResult | null>(null);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [extractType, setExtractType] = useState<ExtractType>('both');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError(t('placeholder'));
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, extractType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extract failed');
      setResult(data);
      setSelectedQuality(0);
    } catch (err: any) {
      setError(err.message || 'Extract failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    const quality = result.qualities[selectedQuality];
    setDownloading(true);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality: quality.value }),
      });
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  const handleCopyText = () => {
    if (result?.textContent) {
      navigator.clipboard.writeText(result.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 提取类型选择 */}
      <div className="flex gap-2 justify-center mb-4">
        {[
          { type: 'both' as ExtractType, icon: '🎬', label: tResult('video') + ' + ' + tResult('text') },
          { type: 'video' as ExtractType, icon: '📹', label: tResult('video') },
          { type: 'text' as ExtractType, icon: '📝', label: tResult('text') },
        ].map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => setExtractType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              extractType === type
                ? 'bg-[#7c6fff] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 输入卡片 */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder={t('placeholder')}
              className="flex-1 bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#7c6fff] transition text-[15px]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-[#7c6fff] to-[#5b4ef0] hover:opacity-85 disabled:opacity-50 text-white rounded-xl px-6 py-3 font-semibold text-[15px] transition whitespace-nowrap"
            >
              {loading ? '...' : t('extract')}
            </button>
          </div>
        </form>

        {/* 平台快捷标签 */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {PLATFORM_TAGS.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setUrl(PLATFORM_EXAMPLES[key])}
              className="text-xs text-white/40 bg-white/6 hover:bg-[#7c6fff]/20 hover:text-[#a99fff] rounded-md px-3 py-1 transition"
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>

      {loading && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="spinner" />
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      )}

      {/* 结果卡片 */}
      {result && !loading && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center text-2xl flex-shrink-0">
              🎬
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px] mb-1 truncate">{result.title}</p>
              <div className="flex gap-3 text-sm text-white/40">
                {result.platform && <span>{result.platform}</span>}
                {result.duration && <span>{result.duration}</span>}
                {result.author && <span>@{result.author}</span>}
              </div>
            </div>
          </div>

          {/* 视频下载 */}
          {result.videoUrl && result.qualities.length > 0 && (
            <>
              <div className="flex gap-2 flex-wrap mb-3">
                {result.qualities.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedQuality(i)}
                    className={`border rounded-lg px-4 py-1.5 text-sm transition ${
                      selectedQuality === i
                        ? 'border-[#7c6fff] bg-[#7c6fff]/20 text-white'
                        : 'border-white/15 text-white/60 hover:border-[#7c6fff]'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`w-full py-3 rounded-xl font-semibold text-[15px] transition mb-3 ${
                  downloading ? 'bg-green-600' : 'bg-gradient-to-br from-[#7c6fff] to-[#5b4ef0] hover:opacity-85'
                } text-white`}
              >
                {downloading ? '✅ ' + tResult('copied') : '⬇️ ' + tResult('download')}
              </button>
            </>
          )}

          {/* 文案复制 */}
          {result.textContent && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3 max-h-40 overflow-y-auto">
                <p className="text-sm text-white/70 whitespace-pre-wrap">{result.textContent}</p>
              </div>
              <button
                onClick={handleCopyText}
                className={`w-full py-3 rounded-xl font-semibold text-[15px] transition ${
                  copied ? 'bg-green-600' : 'bg-white/10 hover:bg-white/15'
                } text-white`}
              >
                {copied ? '✅ ' + tResult('copied') : '📋 ' + tResult('copy')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
