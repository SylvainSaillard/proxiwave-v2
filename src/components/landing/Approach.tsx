'use client';
// T066 — Section Approche — identique prototype

import { Repeat, Eye, Clock, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AnimatedSection from './AnimatedSection';

export default function Approach() {
  const t = useTranslations('approach');

  const blocks = [
    { key: 'block1', icon: Repeat, bg: 'bg-pw-50',   title: t('block1_title'), text: t('block1_text') },
    { key: 'block2', icon: Eye,    bg: 'bg-sky-50',   title: t('block2_title'), text: t('block2_text') },
    { key: 'block3', icon: Clock,  bg: 'bg-warm-50',  title: t('block3_title'), text: t('block3_text') },
  ];

  const comparisonRows = [
    { classic: t('row1_classic'), pw: t('row1_pw') },
    { classic: t('row2_classic'), pw: t('row2_pw') },
    { classic: t('row3_classic'), pw: t('row3_pw') },
    { classic: t('row4_classic'), pw: t('row4_pw') },
  ];

  return (
    <section id="approach" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 max-w-2xl">
            {t('title')}
          </h2>
        </AnimatedSection>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {blocks.map((block, i) => {
            const Icon = block.icon;
            return (
              <AnimatedSection key={block.key} delay={i * 0.1}>
                <div className={`rounded-bento ${block.bg} p-8 sm:p-10 min-h-[280px] flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-300`}>
                  <div className="h-12 w-12 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center shadow-sm">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900">{block.title}</h3>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">{block.text}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection>
          <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="rounded-bento bg-warm-50 p-8 sm:p-10">
              <h4 className="text-lg font-bold text-gray-400 mb-6">{t('compare_classic')}</h4>
              <ul className="space-y-4">
                {comparisonRows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-warm-300 flex items-center justify-center">
                      <X className="h-3 w-3 text-gray-400" />
                    </div>
                    <span className="text-gray-500 text-sm leading-relaxed">{row.classic}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-bento bg-pw-50 p-8 sm:p-10">
              <h4 className="text-lg font-bold text-gray-900 mb-6">{t('compare_pw')}</h4>
              <ul className="space-y-4">
                {comparisonRows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-pw-400 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed font-medium">{row.pw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
