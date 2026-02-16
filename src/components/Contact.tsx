import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Shield, Users } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Placeholder for Airtable addContactMessage API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            {t('contact.title')}
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-lg">
            {t('contact.subtitle')}
          </p>
        </AnimatedSection>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Form */}
          <AnimatedSection>
            <div className="bento-block bg-white p-8 sm:p-10 shadow-sm border border-warm-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.name_label')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('contact.name_placeholder')}
                    className="w-full rounded-xl border border-warm-200 bg-cream px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.email_label')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('contact.email_placeholder')}
                    className="w-full rounded-xl border border-warm-200 bg-cream px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.message_label')}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('contact.message_placeholder')}
                    className="w-full rounded-xl border border-warm-200 bg-cream px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pw-300 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? t('contact.sending') : t('contact.submit')}
                </button>

                {status === 'success' && (
                  <p className="text-sm text-green-600 font-medium text-center">
                    {t('contact.success')}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-500 font-medium text-center">
                    {t('contact.error')}
                  </p>
                )}
              </form>
            </div>
          </AnimatedSection>

          {/* Reassurance blocks */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <AnimatedSection delay={0.1}>
              <div className="bento-block bg-pw-50 p-8 sm:p-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-pw-500" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {t('contact.response_time')}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center">
                    <Users className="h-5 w-5 text-pw-500" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {t('contact.trust')}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bento-block bg-gray-900 p-8 sm:p-10 text-white">
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">
                  Contact direct
                </p>
                <div className="space-y-4">
                  <a
                    href={`mailto:${t('contact.email_direct')}`}
                    className="flex items-center gap-3 text-white hover:text-pw-300 transition-colors group"
                  >
                    <Mail className="h-5 w-5 text-gray-500 group-hover:text-pw-300 transition-colors" />
                    <span className="text-sm font-medium">{t('contact.email_direct')}</span>
                  </a>
                  <a
                    href={`tel:${t('contact.phone')}`}
                    className="flex items-center gap-3 text-white hover:text-pw-300 transition-colors group"
                  >
                    <Phone className="h-5 w-5 text-gray-500 group-hover:text-pw-300 transition-colors" />
                    <span className="text-sm font-medium">{t('contact.phone')}</span>
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
