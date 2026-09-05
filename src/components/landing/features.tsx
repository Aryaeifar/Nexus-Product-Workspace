const features = [
  {
    title: "Issue management",
    body: "See tasks on a Board, List, or Timeline. Precise filters keep the team on the work that matters.",
  },
  {
    title: "Knowledge, connected",
    body: "Nested pages for docs and decisions — so nothing important has to be rebuilt from scratch.",
  },
  {
    title: "Work at the speed of thought",
    body: "Command Palette and keyboard shortcuts move you forward without leaving the page.",
  },
]

const chips = ["Deep filters", "Live views", "Realtime collaboration", "Team presence", "Comments"]

export function LandingFeatures() {
  return (
    <section id="product" className="border-t border-black/6 px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Work
          </p>
          <h2 className="font-heading mt-3 max-w-lg text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-6xl">
            From
            <br />
            rough idea
            <br />
            to shipped
            <br />
            work.
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Build your workflow where conversations, decisions, and team knowledge
          already live.
        </p>
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 sm:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="bg-background p-6 sm:p-8">
            <h3 className="font-heading text-lg font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {feature.body}
            </p>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-black/8 bg-white px-3 py-1 text-[12px] text-muted-foreground"
          >
            {chip}
          </span>
        ))}
      </div>
    </section>
  )
}
