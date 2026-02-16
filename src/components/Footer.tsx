import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-10 px-5 sm:px-8 border-t border-warm-100">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo-proxiwave.png" alt="Proxiwave" className="h-7 w-7" />
          <span className="text-sm font-semibold text-pw-700">Proxiwave</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <span>{t('footer.rights')}</span>
          <a href="#" className="hover:text-gray-600 transition-colors">
            {t('footer.legal')}
          </a>
        </div>
      </div>
    </footer>
  );
}
