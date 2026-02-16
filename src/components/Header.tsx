import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { key: 'approach', href: '#approach' },
  { key: 'results', href: '#results' },
  { key: 'process', href: '#process' },
  { key: 'contact', href: '#contact' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-cream/90 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <img src="/logo-proxiwave.png" alt="Proxiwave" className="h-9 w-9" />
            <span className="text-pw-700">Proxiwave</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.href)}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-pw-50 hover:text-pw-700"
              >
                {t(`nav.${item.key}`)}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              {i18n.language === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link to="/dashboard" className="btn-secondary !py-2.5 !px-5 !text-xs">
              {t('nav.login')}
            </Link>
            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary !py-2.5 !px-5 !text-xs"
            >
              {t('nav.cta')}
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-warm-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/95 backdrop-blur-xl border-t border-warm-100 overflow-hidden"
          >
            <div className="px-5 py-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-warm-100"
                >
                  {t(`nav.${item.key}`)}
                </button>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-primary w-full"
                >
                  {t('nav.cta')}
                </button>
                <button
                  onClick={toggleLang}
                  className="flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium text-gray-500"
                >
                  <Globe className="h-4 w-4" />
                  {i18n.language === 'fr' ? 'English' : 'Français'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
