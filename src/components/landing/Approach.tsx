'use client';
// T066 — Section Approche — identique prototype

import { Repeat, Eye, Clock, Check, X } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const blocks = [
  { key: 'block1', icon: Repeat, bg: 'bg-pw-50',   title: 'Itératif & agile',    text: 'Livraisons fréquentes, feedback continu. Vous voyez l\'avancement en temps réel.' },
  { key: 'block2', icon: Eye,    bg: 'bg-sky-50',   title: 'Transparence totale', text: 'Accès à votre tableau de bord projet 24/7. Aucune surprise sur les délais ou le budget.' },
  { key: 'block3', icon: Clock,  bg: 'bg-warm-50',  title: 'Livraison rapide',    text: 'De l\'idée au produit en 4 semaines. Notre processus éprouvé garantit les délais.' },
];

const comparisonRows = [
  { classic: 'Délais imprévisibles et dépassements fréquents', pw: 'Planning ferme, livraison garantie en 4 semaines' },
  { classic: 'Communication rare et peu transparente', pw: 'Dashboard temps réel + réunions hebdomadaires' },
  { classic: 'Budget flou, surprises en cours de route', pw: 'Prix fixe, aucun surcoût caché' },
  { classic: 'Vous découvrez le résultat à la fin', pw: 'Vous validez chaque étape en amont' },
];

export default function Approach() {
  return (
    <section id="approach" className="py-20 sm:py-28 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 max-w-2xl">
            Une approche qui change tout
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
              <h4 className="text-lg font-bold text-gray-400 mb-6">Approche classique</h4>
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
              <h4 className="text-lg font-bold text-gray-900 mb-6">Avec Proxiwave</h4>
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
