'use client';
// T068 — Section Contact — formulaire avec Server Action

import { useState, useRef } from 'react';
import { Mail, Phone, Shield, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AnimatedSection from './AnimatedSection';
import { submitContact } from '@/actions/contact';

export default function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const formData = new FormData(e.currentTarget);
      await submitContact(formData);
      setStatus('success');
      formRef.current?.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-lg">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Form */}
          <AnimatedSection>
            <div className="rounded-bento bg-white p-8 sm:p-10 shadow-sm border border-warm-100">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">{t('name_label')}</label>
                  <input
                    id="name" name="name" type="text" required
                    placeholder={t('name_placeholder')}
                    className="w-full rounded-xl border border-warm-200 bg-cream px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">{t('email_label')}</label>
                  <input
                    id="email" name="email" type="email" required
                    placeholder={t('email_placeholder')}
                    className="w-full rounded-xl border border-warm-200 bg-cream px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">{t('message_label')}</label>
                  <textarea
                    id="message" name="message" required rows={4}
                    placeholder={t('message_placeholder')}
                    className="w-full rounded-xl border border-warm-200 bg-cream px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-full px-8 py-4 bg-gray-900 text-white font-semibold hover:bg-pw-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? t('sending') : t('submit')}
                </button>

                {status === 'success' && (
                  <p className="text-sm text-green-600 font-medium text-center">{t('success')}</p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-500 font-medium text-center">{t('error')}</p>
                )}
              </form>
            </div>
          </AnimatedSection>

          {/* Reassurance */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <AnimatedSection delay={0.1}>
              <div className="rounded-bento bg-pw-50 p-8 sm:p-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-pw-500" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">{t('response_time')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                    <Users className="h-5 w-5 text-pw-500" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">{t('trust')}</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="rounded-bento bg-gray-900 p-8 sm:p-10 text-white">
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">{t('contact_direct')}</p>
                <div className="space-y-4">
                  <a href="mailto:sylvainsaillard@proxiwave.com" className="flex items-center gap-3 text-white hover:text-pw-300 transition-colors group">
                    <Mail className="h-5 w-5 text-gray-500 group-hover:text-pw-300 transition-colors" />
                    <span className="text-sm font-medium">sylvainsaillard@proxiwave.com</span>
                  </a>
                  <a href="tel:0040771481101" className="flex items-center gap-3 text-white hover:text-pw-300 transition-colors group">
                    <Phone className="h-5 w-5 text-gray-500 group-hover:text-pw-300 transition-colors" />
                    <span className="text-sm font-medium">0040 771 481 101</span>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
