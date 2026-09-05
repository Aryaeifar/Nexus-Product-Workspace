import { LandingClarity } from "@/components/landing/clarity"
import { LandingFeatures } from "@/components/landing/features"
import { LandingFooter } from "@/components/landing/footer"
import { LandingHeader } from "@/components/landing/header"
import { LandingHero } from "@/components/landing/hero"
import { LandingTrust } from "@/components/landing/trust"

export function LandingPage() {
  return (
    <div id="top" className="min-h-svh bg-[#f4f3f0] text-foreground">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingClarity />
        <LandingTrust />
      </main>
      <LandingFooter />
    </div>
  )
}
