// T069 — Page d'accueil landing — Server Component

import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Approach from '@/components/landing/Approach';
import Results from '@/components/landing/Results';
import Process from '@/components/landing/Process';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="bg-cream min-h-screen">
      <Header />
      <Hero />
      <Approach />
      <Results />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
