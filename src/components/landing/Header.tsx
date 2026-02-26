'use client';
// T064 — Header landing — identique prototype

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'approach', href: '#approach', label: 'Approche' },
  { key: 'results', href: '#results', label: 'Résultats' },
  { key: 'process', href: '#process', label: 'Processus' },
  { key: 'contact', href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-cream/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <div className="h-9 w-9 rounded-xl overflow-hidden">
              <Image
                src="/logo-proxiwave.png"
                alt="Proxiwave"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
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
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-5 py-2.5 text-xs font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-warm-50 transition-colors"
            >
              Se connecter
            </Link>
            <button
              onClick={() => handleNavClick('#contact')}
              className="rounded-full px-5 py-2.5 text-xs font-semibold bg-gray-900 text-white hover:bg-pw-600 transition-colors"
            >
              Nous contacter
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-warm-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
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
                  {item.label}
                </button>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="w-full rounded-full px-5 py-3 text-sm font-semibold bg-gray-900 text-white hover:bg-pw-600 transition-colors"
                >
                  Nous contacter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
