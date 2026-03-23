import { useTranslations } from 'next-intl';
import ExtractForm from '@/components/ExtractForm';
import PlatformGrid from '@/components/PlatformGrid';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{t('title')}</h1>
        <p className="text-gray-600 text-center mb-12">{t('subtitle')}</p>
        
        <ExtractForm />
        
        <PlatformGrid />
      </div>
    </main>
  );
}
