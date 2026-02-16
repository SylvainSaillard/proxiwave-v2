import { useTranslation } from 'react-i18next';
import { Building2, Factory, TrendingUp } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const IMAGES = {
  consulting: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop',
  industrial: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80&auto=format&fit=crop',
  realestate: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop',
};

export default function Results() {
  const { t } = useTranslation();

  return (
    <section id="results" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 max-w-2xl">
            {t('results.title')}
          </h2>
        </AnimatedSection>

        {/* Bento grid — image blocks + case blocks + stat blocks */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">

          {/* Case 1 — Image block with overlay */}
          <AnimatedSection className="md:col-span-5 md:row-span-2" delay={0}>
            <div className="bento-block relative h-full min-h-[340px] group cursor-pointer overflow-hidden">
              <img
                src={IMAGES.consulting}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-white/90 mb-4">
                  <Building2 className="h-3 w-3" />
                  {t('results.case1_industry')}
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {t('results.case1_stat')}
                  </span>
                  <span className="text-lg font-semibold text-white/60">
                    {t('results.case1_stat_suffix')}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">
                  {t('results.case1_context')} {t('results.case1_result')}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Case 2 — text block */}
          <AnimatedSection className="md:col-span-4" delay={0.1}>
            <div className="bento-block bg-pw-50 p-7 sm:p-8 min-h-[200px] flex flex-col justify-between group hover:scale-[1.005] transition-transform duration-300">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Factory className="h-3.5 w-3.5" />
                {t('results.case2_industry')}
              </span>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-pw-600">
                    {t('results.case2_stat')}
                  </span>
                  <span className="text-base font-semibold text-gray-400">
                    {t('results.case2_stat_suffix')}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {t('results.case2_context')}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Case 2 image — small */}
          <AnimatedSection className="md:col-span-3" delay={0.15}>
            <div className="bento-block relative min-h-[200px] group cursor-pointer overflow-hidden">
              <img
                src={IMAGES.industrial}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow">
                3x plus rapide
              </span>
            </div>
          </AnimatedSection>

          {/* Case 3 — text block */}
          <AnimatedSection className="md:col-span-3" delay={0.2}>
            <div className="bento-block bg-sky-50 p-7 sm:p-8 min-h-[200px] flex flex-col justify-between group hover:scale-[1.005] transition-transform duration-300">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" />
                {t('results.case3_industry')}
              </span>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-pw-500">
                    {t('results.case3_stat')}
                  </span>
                  <span className="text-base font-semibold text-gray-400">
                    {t('results.case3_stat_suffix')}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {t('results.case3_context')}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Real estate image */}
          <AnimatedSection className="md:col-span-4" delay={0.25}>
            <div className="bento-block relative min-h-[200px] group cursor-pointer overflow-hidden">
              <img
                src={IMAGES.realestate}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow">
                +40% de leads
              </span>
            </div>
          </AnimatedSection>

        </div>

        {/* KPI blocks */}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <AnimatedSection delay={0}>
            <div className="bento-block bg-gray-900 p-8 sm:p-10 text-center min-h-[160px] flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">
                {t('results.kpi1_value')}
              </span>
              <span className="mt-2 text-sm font-medium text-gray-400">
                {t('results.kpi1_label')}
              </span>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bento-block bg-pw-500 p-8 sm:p-10 text-center min-h-[160px] flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">
                {t('results.kpi2_value')}
              </span>
              <span className="mt-2 text-sm font-medium text-pw-100">
                {t('results.kpi2_label')}
              </span>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="bento-block bg-sky-50 p-8 sm:p-10 text-center min-h-[160px] flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-pw-700">
                {t('results.kpi3_value')}
              </span>
              <span className="mt-2 text-sm font-medium text-gray-500">
                {t('results.kpi3_label')}
              </span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
