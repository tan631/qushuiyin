'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Header({ session }: { session: any }) {
  const t = useTranslations('home');

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">去水印</Link>
        
        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <Link href="/profile" className="text-blue-600">{t('profile')}</Link>
              <span>{session.user?.name}</span>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">{t('login')}</Link>
          )}
        </div>
      </div>
    </header>
  );
}
