import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import ExtractForm from '@/components/ExtractForm';
import Header from '@/components/Header';

export default async function HomePage() {
  const t = await getTranslations('home');
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Header session={session} />
      
      {/* Hero 区域 */}
      <div className="container mx-auto px-6 py-20 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-[#7c6fff]/15 border border-[#7c6fff]/30 rounded-full px-4 py-1.5 text-sm text-[#a99fff] mb-8">
          ⚡ TikTok · YouTube · Twitter
        </div>
        
        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent leading-tight">
          {t('title')}
        </h1>
        
        <p className="text-xl text-white/50 mb-16 leading-relaxed max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        
        <ExtractForm />
      </div>

      {/* 功能特性 */}
      <section className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: '极速解析', desc: '秒级解析视频链接，无需等待' },
            { icon: '🎯', title: '无水印原版', desc: '去除平台水印，下载原始视频' },
            { icon: '📦', title: '多平台支持', desc: '支持主流视频平台一键提取' },
            { icon: '🔒', title: '隐私安全', desc: '不存储视频，保护用户隐私' },
            { icon: '📱', title: '多端适配', desc: '完美适配手机、平板、电脑' },
            { icon: '💾', title: '历史记录', desc: '登录后自动保存提取历史' },
          ].map((f, i) => (
            <div key={i} className="group bg-white/4 border border-white/8 hover:border-[#7c6fff]/40 rounded-2xl p-8 transition-all hover:bg-white/6">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 底部 */}
      <footer className="border-t border-white/6 py-8 text-center text-sm text-white/30">
        © 2025 去水印 · 仅供个人学习使用
      </footer>
    </main>
  );
}
