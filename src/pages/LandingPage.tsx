import { Hero } from '../components/sections/Hero';
import { Agitation } from '../components/sections/Agitation';
import { Solution } from '../components/sections/Solution';
import { Quote } from '../components/sections/Quote';
import { Reboot } from '../components/sections/Reboot';
import { Pulse } from '../components/sections/Pulse';
import { Clock } from '../components/sections/Clock';
import { Balance } from '../components/sections/Balance';
import { BlueGlow } from '../components/sections/BlueGlow';
import { Orbit } from '../components/sections/Orbit';
import { Author } from '../components/sections/Author';
import { SocialProof } from '../components/sections/SocialProof';
import { Offer } from '../components/sections/Offer';
import { FAQ } from '../components/sections/FAQ';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { SmoothScroll } from '../components/ui/SmoothScroll';
import { MobileStickyCTA } from '../components/ui/MobileStickyCTA';

export function LandingPage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-brand-primary text-brand-secondary selection:bg-brand-secondary selection:text-brand-primary">
        <NoiseOverlay />
        <ThemeToggle />
        <Hero />
        <Agitation />
        <Solution />
        <Quote />
        <Reboot />
        <Pulse />
        <Clock />
        <Balance />
        <BlueGlow />
        <Orbit />
        <Author />
        <SocialProof />
        <Offer />
        <FAQ />
        <MobileStickyCTA />
      </main>
    </SmoothScroll>
  );
}
