import { FadeIn } from "@/components/landing/fade-in"
import { ProductPreview } from "@/components/landing/product-preview"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-10%,rgba(0,0,0,0.06),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="mb-6 text-center text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Built for teams that move fast
          </p>
          <h1 className="font-heading mx-auto max-w-3xl text-center text-[3.1rem] leading-[0.92] font-semibold tracking-[-0.04em] text-balance sm:text-[5.4rem]">
            Your team&apos;s
            <br />
            work,
            <br />
            clear and
            <br />
            connected.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-center text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
            Vela combines task management, team knowledge, and product planning
            so everyone knows what matters and what comes next.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="h-10 px-4">
              Create your workspace
            </Button>
            <Button size="lg" variant="outline" className="h-10 px-4">
              Watch product tour
            </Button>
          </div>
        </FadeIn>
        <FadeIn className="mt-14" delay={0.12}>
          <ProductPreview />
        </FadeIn>
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-black/6 pt-8 sm:flex-row sm:justify-between">
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            One system, every kind of work
          </p>
          <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
            {["N", "A", "S", "+"].map((mark) => (
              <span key={mark} className="font-heading text-lg font-semibold tracking-tight">
                {mark}
              </span>
            ))}
            <span className="hidden text-[12px] sm:inline">
              Trusted by 2,400+ teams of every size
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
