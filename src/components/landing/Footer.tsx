// T068 — Footer landing

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="py-10 px-5 sm:px-8 border-t border-warm-100">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg overflow-hidden">
            <Image
              src="/logo-proxiwave.png"
              alt="Proxiwave"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-pw-700">Proxiwave</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <span>{t('rights')}</span>
          <a href="/mentions-legales" className="hover:text-gray-600 transition-colors">{t('legal')}</a>
        </div>
      </div>
    </footer>
  );
}
