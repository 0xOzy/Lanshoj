import { About } from "@/components/about"
import { BackToTop } from "@/components/back-to-top"
import { Community } from "@/components/community"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { MarketTerminal } from "@/components/market-terminal"
import { Navbar } from "@/components/navbar"
import { Roadmap } from "@/components/roadmap"
import { SideNav } from "@/components/side-nav"
import { Tokenomics } from "@/components/tokenomics"
import { Suspense } from "react"

function LoadingSection() {
  return (
    <div className="py-8 animate-pulse">
      <div className="h-8 bg-muted/30 rounded-md w-1/4 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-muted/30 rounded-lg"></div>
        <div className="h-64 bg-muted/30 rounded-lg"></div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <SideNav />
      <BackToTop />
      <div className="container mx-auto px-4 py-8">
        <section id="hero">
          <Suspense fallback={<LoadingSection />}>
            <Hero />
          </Suspense>
        </section>
        <section id="market">
          <Suspense fallback={<LoadingSection />}>
            <MarketTerminal />
          </Suspense>
        </section>
        <section id="about">
          <Suspense fallback={<LoadingSection />}>
            <About />
          </Suspense>
        </section>
        <section id="features">
          <Suspense fallback={<LoadingSection />}>
            <Features />
          </Suspense>
        </section>
        <section id="roadmap">
          <Suspense fallback={<LoadingSection />}>
            <Roadmap />
          </Suspense>
        </section>
        <section id="community">
          <Suspense fallback={<LoadingSection />}>
            <Community />
          </Suspense>
        </section>
        <section id="tokenomics">
          <Suspense fallback={<LoadingSection />}>
            <Tokenomics />
          </Suspense>
        </section>
      </div>
      <Footer />
    </main>
  )
}

