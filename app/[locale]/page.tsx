import { useTranslations } from 'next-intl';
import { auth } from '@/lib/auth';
import ExtractForm from '@/components/ExtractForm';
import PlatformGrid from '@/components/PlatformGrid';
import Header from '@/components/Header';

export default async function HomePage() {
  const t = useTranslations('home');
  const session = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header session={session} />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">{t('title')}</h1>
        <p className="text-gray-600 text-center mb-12">{t('subtitle')}</p>
        
        <ExtractForm />
        
        <PlatformGrid />
      </div>
    </main>
  );
}
