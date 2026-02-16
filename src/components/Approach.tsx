import { useTranslation } from 'react-i18next';
import { Repeat, Eye, Clock, Check, X } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const blocks = [
  { key: 'block1', icon: Repeat, bg: 'bg-pw-50' },
  { key: 'block2', icon: Eye, bg: 'bg-sky-50' },
  { key: 'block3', icon: Clock, bg: 'bg-warm-50' },
];

const comparisonRows = [
  'row1',
  'row2',
  'row3',
  'row4',
] as const;

export default function Approach() {
  const { t } = useTranslation();

  return (
    <section id="approach" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section title */}
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 max-w-2xl">
            {t('approach.title')}
          </h2>
        </AnimatedSection>

        {/* 3 Blocks grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {blocks.map((block, i) => {
            const Icon = block.icon;
            return (
              <AnimatedSection key={block.key} delay={i * 0.1}>
                <div className={`bento-block ${block.bg} p-8 sm:p-10 min-h-[280px] flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-300`}>
                  <div className="h-12 w-12 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center shadow-sm">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900">
                      {t(`approach.${block.key}_title`)}
                    </h3>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">
                      {t(`approach.${block.key}_text`)}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Comparison table */}
        <AnimatedSection>
          <div className="mt-16 sm:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Classic approach */}
              <div className="bento-block bg-warm-50 p-8 sm:p-10">
                <h4 className="text-lg font-bold text-gray-400 mb-6">
                  {t('approach.compare_classic')}
                </h4>
                <ul className="space-y-4">
                  {comparisonRows.map((row) => (
                    <li key={row} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-warm-300 flex items-center justify-center">
                        <X className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-gray-500 text-sm leading-relaxed">
                        {t(`approach.compare_${row}_classic`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proxiwave approach */}
              <div className="bento-block bg-pw-50 p-8 sm:p-10">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  {t('approach.compare_proxiwave')}
                </h4>
                <ul className="space-y-4">
                  {comparisonRows.map((row) => (
                    <li key={row} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-pw-400 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed font-medium">
                        {t(`approach.compare_${row}_pw`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
