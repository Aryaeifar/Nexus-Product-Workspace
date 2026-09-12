import { FadeIn, ProductReveal } from "@/components/landing/fade-in"
import { ProductPreview } from "@/components/landing/product-preview"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="bg-background px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-[980px] text-center">
        <FadeIn>
          <h1 className="text-hero-display text-foreground">
            Your team&apos;s work,
            <br />
            clear and connected.
          </h1>
        </FadeIn>
        <FadeIn delay={0.08}>
          <p className="text-lead text-foreground mx-auto mt-4 max-w-[640px]">
            Task management, team knowledge, and product planning in one
            workspace.
          </p>
        </FadeIn>
        <FadeIn delay={0.16}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button>Create your workspace</Button>
            <Button variant="outline">Learn more</Button>
          </div>
        </FadeIn>
        <ProductReveal className="mt-16">
          <ProductPreview />
        </ProductReveal>
      </div>
    </section>
  )
}
