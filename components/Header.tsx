'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export default function Header({ session }: { session: any }) {
  const t = useTranslations('home');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/8">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-xl font-bold">
          去<span className="text-[#7c6fff]">水印</span>
        </Link>
        
        <div className="flex gap-4 items-center">
          {/* 语言切换 */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => switchLocale('zh')}
              className={`px-3 py-1.5 rounded text-sm transition ${
                locale === 'zh' ? 'bg-[#7c6fff] text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => switchLocale('en')}
              className={`px-3 py-1.5 rounded text-sm transition ${
                locale === 'en' ? 'bg-[#7c6fff] text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {session ? (
            <>
              <Link href={`/${locale}/profile`} className="text-white/60 hover:text-white transition text-sm">
                {t('profile')}
              </Link>
              <span className="text-sm text-white/80">{session.user?.name}</span>
            </>
          ) : (
            <Link 
              href="/api/auth/signin" 
              className="px-5 py-2 bg-[#7c6fff] hover:bg-[#6a5de8] text-white rounded-lg text-sm font-medium transition"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
