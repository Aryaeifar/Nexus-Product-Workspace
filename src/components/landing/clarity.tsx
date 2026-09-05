const points = [
  {
    title: "One source of truth",
    body: "Turn Roadmap and Cycles into a single source of truth. Everyone knows what is in progress, what is slipping, and what comes next.",
  },
  {
    title: "Right beside the work",
    body: "Comments and decisions stay next to the work they belong to.",
  },
  {
    title: "A role for everyone",
    body: "Manage permissions in language people understand. Clear access for each role, saved in a few clicks.",
  },
  {
    title: "This moment",
    body: "See activity as it happens. Everything has a shortcut — start from ⌘K and keep moving from wherever you are.",
  },
]

export function LandingClarity() {
  return (
    <section id="how-it-works" className="border-t border-black/6 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading max-w-xl text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-7xl">
          Clarity
          <br />
          without
          <br />
          another
          <br />
          meeting.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {points.map((point) => (
            <article
              key={point.title}
              className="rounded-2xl border border-black/8 bg-white p-6"
            >
              <h3 className="font-heading text-base font-semibold">{point.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {point.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
