import { FadeIn, Stagger, StaggerItem } from "@/components/landing/fade-in"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Issues",
    tagline: "Board. List. Timeline.",
    body: "See every task in the view that fits the work. Precise filters keep the team on what matters.",
  },
  {
    title: "Knowledge",
    tagline: "Nested pages that stay connected.",
    body: "Docs and decisions live next to the work — so nothing important is rebuilt from scratch.",
  },
  {
    title: "Speed",
    tagline: "Command Palette. Shortcuts.",
    body: "Move through the workspace without leaving the page. ⌘K is the front door.",
  },
]

export function LandingFeatures() {
  return (
    <section id="product">
      <div className="bg-apple-tile-1 px-5 py-20 text-center text-white">
        <div className="mx-auto max-w-[980px]">
          <FadeIn inView>
            <h2 className="text-display-lg">From rough idea to shipped work.</h2>
            <p className="text-lead mx-auto mt-4 max-w-[620px] text-apple-body-muted">
              Build the workflow where conversations, decisions, and team knowledge
              already live.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button>Learn more</Button>
              <a href="#how-it-works" className="text-body text-apple-primary-on-dark">
                See how it works
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
      <div className="bg-apple-parchment px-5 py-20">
        <Stagger className="mx-auto grid max-w-[980px] gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <article className="rounded-[18px] border border-apple-hairline bg-apple-canvas p-6">
                <h3 className="text-body-strong">{feature.title}</h3>
                <p className="text-caption mt-2 text-apple-ink">{feature.tagline}</p>
                <p className="text-caption mt-3 text-apple-ink-muted-48">{feature.body}</p>
                <a href="#how-it-works" className="text-caption mt-5 inline-block text-apple-primary">
                  Learn more
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
