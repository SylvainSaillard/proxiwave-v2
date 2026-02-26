'use client';
// T068 — Page Mentions Légales

import { Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-cream py-20 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-8">
          Mentions Légales
        </h1>

        <div className="space-y-8">
          {/* Société */}
          <section className="bg-white rounded-bento p-8 shadow-sm border border-warm-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-pw-500" />
              Informations sur la société
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Raison sociale :</strong> Proxiwave srl</p>
              <p><strong>CUI (Identifiant fiscal) :</strong> RO36877369</p>
              <p><strong>Numéro d'enregistrement :</strong> J40/16978/2016</p>
              <p><strong>Adresse :</strong> Strada Roma 42a, Sector 1, Bucuresti, Roumanie</p>
              <p><strong>Code postal :</strong> 011775</p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-bento p-8 shadow-sm border border-warm-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-pw-500" />
                <a href="mailto:sylvainsaillard@proxiwave.com" className="text-gray-700 hover:text-pw-600 transition-colors">
                  sylvainsaillard@proxiwave.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-pw-500" />
                <a href="tel:0040771481101" className="text-gray-700 hover:text-pw-600 transition-colors">
                  0040 771 481 101
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-pw-500" />
                <span className="text-gray-700">
                  Strada Roma 42a, Sector 1, Bucuresti, Roumanie
                </span>
              </div>
            </div>
          </section>

          {/* Hébergement */}
          <section className="bg-white rounded-bento p-8 shadow-sm border border-warm-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <p className="text-gray-700">
              Ce site web est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-white rounded-bento p-8 shadow-sm border border-warm-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-700">
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
