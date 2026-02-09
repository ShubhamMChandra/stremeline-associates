import { Hero } from "../src/components/home/hero";
import { Capabilities } from "../src/components/home/capabilities";
import { SocialProof } from "../src/components/home/social-proof";
import { UseCases } from "../src/components/home/use-cases";
import { CTASection } from "../src/components/home/cta-section";
import { Header } from "../src/components/layout/header";
import { Footer } from "../src/components/layout/footer";

/**
 * What this does: Home page composing 5 visually distinct sections
 * Why it's here: Main entry point — the first thing visitors see
 * How it works: Server component that composes client-side section components in order:
 *   Hero (full viewport) > Capabilities (BentoGrid showcase) > Social Proof (compact data band)
 *   > Use Cases (self-identification) > CTA (emotional closer with conversion action)
 * Dependencies: All home section components, layout components
 */
export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="min-h-screen pt-16">
        <Hero />
        <Capabilities />
        <SocialProof />
        <UseCases />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
