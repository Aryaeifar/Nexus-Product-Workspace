import { Calendar, Command, Layers, Bell } from "lucide-react"

import { ActivityList } from "@/components/landing/activity-list"
import { FadeIn } from "@/components/landing/fade-in"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Button } from "@/components/ui/button"
import { Marquee } from "@/components/ui/marquee"

const pages = [
  { name: "Onboarding PRD", body: "Nested page for the Q3 launch flow." },
  { name: "Permissions", body: "Roles, guests, and workspace access." },
  { name: "Cycle 24", body: "What ships this week — and what waits." },
  { name: "Design system", body: "Command menu states and tokens." },
]

const features = [
  {
    Icon: Layers,
    name: "Knowledge",
    description: "Nested pages for docs and decisions — nothing rebuilt from scratch.",
    href: "#how-it-works",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:22s]"
      >
        {pages.map((page) => (
          <figure
            key={page.name}
            className="w-36 rounded-[11px] border border-apple-hairline bg-background p-3 dark:border-white/10"
          >
            <figcaption className="text-caption font-semibold">{page.name}</figcaption>
            <blockquote className="text-fine mt-1 text-muted-foreground">
              {page.body}
            </blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Bell,
    name: "Live activity",
    description: "See comments, cycle moves, and assignments as they happen.",
    href: "#how-it-works",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <ActivityList className="absolute top-6 right-0 w-full scale-90 [mask-image:linear-gradient(to_top,transparent_8%,#000_55%)]" />
    ),
  },
  {
    Icon: Command,
    name: "Command Palette",
    description: "⌘K is the front door. Shortcuts move you without leaving the page.",
    href: "#how-it-works",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute top-10 left-8 right-8 rounded-full border border-apple-hairline bg-background px-5 py-3 text-left dark:border-white/10">
        <p className="text-caption text-muted-foreground">Search issues, pages, people</p>
        <p className="text-body-strong mt-1">NEX-204 Sync activity timeline</p>
      </div>
    ),
  },
  {
    Icon: Calendar,
    name: "Cycles",
    description: "Roadmap and Cycles stay the single source of truth.",
    href: "#security",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute top-12 right-6 rounded-[18px] border border-apple-hairline bg-background px-4 py-3 dark:border-white/10">
        <p className="text-caption text-muted-foreground">Current cycle</p>
        <p className="text-body-strong">Q3 launch · 12 issues</p>
      </div>
    ),
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
      <div className="bg-muted px-5 py-20">
        <BentoGrid className="mx-auto max-w-[980px] grid-cols-1 sm:grid-cols-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
