import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Award } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const IMAGES = {
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
  meeting: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop',
  workspace: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&q=80&auto=format&fit=crop',
};

export default function Hero() {
  const { t } = useTranslation();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 pb-8 sm:pt-32 sm:pb-12 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Bento Grid — 12 cols, 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-[auto_auto] gap-4 sm:gap-5">

          {/* ═══ Block 1 — Large image left (spans 2 rows) ═══ */}
          <AnimatedSection className="md:col-span-3 md:row-span-2">
            <div className="bento-block relative h-full min-h-[340px] group cursor-pointer overflow-hidden">
              <img
                src={IMAGES.team}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-5 left-5"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-semibold text-gray-800 shadow-lg">
                  <Users className="h-3.5 w-3.5 text-pw-500" />
                  {t('hero.social_proof')}
                </span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* ═══ Block 2 — Title + CTA (top center) ═══ */}
          <AnimatedSection className="md:col-span-6">
            <div className="bento-block bg-pw-50 p-8 sm:p-10 flex flex-col justify-between min-h-[340px]">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.12] tracking-tight text-gray-900"
              >
                {t('hero.title')}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-5 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {['bg-pw-400', 'bg-pw-600', 'bg-sky-400', 'bg-pw-500'].map((bg, i) => (
                    <div
                      key={i}
                      className={`h-9 w-9 rounded-full ${bg} border-[2.5px] border-pw-50 flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {['SL', 'MR', 'JP', 'AC'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-500">{t('hero.social_proof')}</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-6 flex justify-end"
              >
                <button
                  onClick={() => handleScroll('#approach')}
                  className="h-14 w-14 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-pw-600 transition-colors duration-300 hover:scale-105 active:scale-95 shadow-lg"
                  aria-label={t('hero.cta_secondary')}
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* ═══ Block 3 — Image with text overlay right (spans 2 rows) ═══ */}
          <AnimatedSection className="md:col-span-3 md:row-span-2">
            <div className="bento-block relative h-full min-h-[340px] group cursor-pointer overflow-hidden">
              <img
                src={IMAGES.office}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
              <div className="relative p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {t('approach.block2_title')}
                </h3>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">
                  {t('approach.block2_text')}
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-5 right-5"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-semibold text-gray-800 shadow-lg">
                  <Award className="h-3.5 w-3.5 text-pw-500" />
                  {t('hero.badge')}
                </span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* ═══ ROW 2 center — 3 blocks filling the 6 center cols ═══ */}

          {/* Block 4 — Small image + floating badge */}
          <AnimatedSection className="md:col-span-2" delay={0.05}>
            <div className="bento-block relative min-h-[200px] group cursor-pointer overflow-hidden">
              <img
                src={IMAGES.workspace}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-4 left-4"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow">
                  <Sparkles className="h-3 w-3 text-pw-500" />
                  Sur-mesure
                </span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Block 5 — Stat "50+" */}
          <AnimatedSection className="md:col-span-2" delay={0.1}>
            <div className="bento-block bg-sky-50 p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
              <span className="text-4xl sm:text-5xl font-extrabold text-pw-600 tracking-tight">50+</span>
              <span className="mt-2 text-xs font-semibold text-gray-500 leading-tight">
                {t('results.kpi1_label')}
              </span>
            </div>
          </AnimatedSection>

          {/* Block 6 — Stat "4 sem" accent bg */}
          <AnimatedSection className="md:col-span-2" delay={0.15}>
            <div className="bento-block bg-pw-500 p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {t('hero.stat_value')}
              </span>
              <span className="mt-2 text-xs font-semibold text-pw-100 leading-tight">
                {t('hero.stat_label')}
              </span>
            </div>
          </AnimatedSection>

        </div>

        {/* CTA bar below bento */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button onClick={() => handleScroll('#contact')} className="btn-primary">
            {t('hero.cta_primary')}
          </button>
          <button onClick={() => handleScroll('#approach')} className="btn-secondary">
            {t('hero.cta_secondary')}
          </button>
        </motion.div>

      </div>
    </section>
  );
}
