import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { SlackIntegration } from './components/SlackIntegration';
import { Integrations } from './components/Integrations';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { GlobalParticleBackground } from './components/GlobalParticleBackground';

function App() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Fixed page-wide particle background */}
      <GlobalParticleBackground />

      {/* All content above particles */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <SlackIntegration />
          <Integrations />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
