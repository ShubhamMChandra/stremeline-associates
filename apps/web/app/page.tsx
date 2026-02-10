import { Hero } from "../src/components/home/hero";
import { ProblemScroll } from "../src/components/home/problem-scroll";
import { Capabilities } from "../src/components/home/capabilities";
import { CounterWall } from "../src/components/home/counter-wall";
import { UseCases } from "../src/components/home/use-cases";
import { CTASection } from "../src/components/home/cta-section";
import { Header } from "../src/components/layout/header";
import { Footer } from "../src/components/layout/footer";
import { ScrollProgress } from "../src/components/ui/scroll-progress";

/**
 * What this does: Home page composing 6 visually distinct sections in a dark/light sandwich
 * Why it's here: Main entry point — every scroll position has been designed
 * How it works: Server component composing client sections with gradient transitions between
 *   dark and light zones. Hero (dark) → ProblemScroll (dark) → Capabilities (light) →
 *   CounterWall (dark) → UseCases (light) → CTA (dark)
 * Dependencies: All home section components, layout components, ScrollProgress
 */
export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content" className="min-h-screen pt-16">
        {/* ── Dark zone: Hero + Problem ── */}
        <Hero />
        <ProblemScroll />

        {/* ── Transition: dark → light ── */}
        <div
          className="h-8 md:h-12"
          style={{
            background: "linear-gradient(to bottom, #0A0A0B, #FAFAF9)",
          }}
          aria-hidden="true"
        />

        {/* ── Light zone: Capabilities ── */}
        <Capabilities />

        {/* ── Transition: light → dark ── */}
        <div
          className="h-8 md:h-12"
          style={{
            background: "linear-gradient(to bottom, #FAFAF9, #0A0A0B)",
          }}
          aria-hidden="true"
        />

        {/* ── Dark zone: Counter Wall ── */}
        <CounterWall />

        {/* ── Transition: dark → light ── */}
        <div
          className="h-8 md:h-12"
          style={{
            background: "linear-gradient(to bottom, #0A0A0B, #FAFAF9)",
          }}
          aria-hidden="true"
        />

        {/* ── Light zone: Use Cases ── */}
        <UseCases />

        {/* ── Transition: light → dark ── */}
        <div
          className="h-8 md:h-12"
          style={{
            background: "linear-gradient(to bottom, #FAFAF9, #0A0A0B)",
          }}
          aria-hidden="true"
        />

        {/* ── Dark zone: CTA ── */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
