'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t('googleLogin')}
        </button>
      </div>
    </div>
  );
}
