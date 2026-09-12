import { LandingClarity } from "@/components/landing/clarity"
import { LandingFeatures } from "@/components/landing/features"
import { LandingFooter } from "@/components/landing/footer"
import { LandingHeader } from "@/components/landing/header"
import { LandingHero } from "@/components/landing/hero"
import { LogoMarquee } from "@/components/landing/logo-marquee"
import { MobileDock } from "@/components/landing/mobile-dock"
import { LandingTrust } from "@/components/landing/trust"

export function LandingPage() {
  return (
    <div id="top" className="bg-background text-foreground min-h-svh pb-24 md:pb-0">
      <LandingHeader />
      <main>
        <LandingHero />
        <LogoMarquee />
        <LandingFeatures />
        <LandingClarity />
        <LandingTrust />
      </main>
      <LandingFooter />
      <MobileDock />
    </div>
  )
}
