'use client';
// T067 — Section Processus — identique prototype

import { Search, Wrench, HeartHandshake, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AnimatedSection from './AnimatedSection';

export default function Process() {
  const t = useTranslations('process');

  const steps = [
    { key: 'step1', icon: Search,        bg: 'bg-pw-50',   number: '01', title: t('step1_title'), text: t('step1_text') },
    { key: 'step2', icon: Wrench,         bg: 'bg-sky-50',  number: '02', title: t('step2_title'), text: t('step2_text') },
    { key: 'step3', icon: HeartHandshake, bg: 'bg-warm-50', number: '03', title: t('step3_title'), text: t('step3_text') },
  ];

  const handleScroll = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="process" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 max-w-2xl">
            {t('title')}
          </h2>
        </AnimatedSection>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.key} delay={i * 0.15}>
                <div className={`rounded-bento ${step.bg} p-8 sm:p-10 min-h-[320px] flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-300`}>
                  <div className="flex items-center justify-between">
                    <span className="text-5xl sm:text-6xl font-extrabold text-gray-900/10">{step.number}</span>
                    <div className="h-12 w-12 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center shadow-sm">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-4 sm:mt-5 rounded-bento bg-gray-900 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-pw-400/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-pw-300" />
              </div>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
                {t('reassurance')}
              </p>
            </div>
            <button
              onClick={handleScroll}
              className="flex-shrink-0 rounded-full bg-white text-gray-900 px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('cta')}
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
