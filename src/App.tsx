import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Approach from './components/Approach';
import Results from './components/Results';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DashboardLayout from './dashboard/DashboardLayout';
import ProjectDetailView from './dashboard/ProjectDetailView';

function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <Hero />
        <Approach />
        <Results />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="/dashboard/project/:id" element={<ProjectDetailView />} />
    </Routes>
  );
}

export default App;
