import { FadeIn, Stagger, StaggerItem } from "@/components/landing/fade-in"

const points = [
  {
    title: "One source of truth",
    body: "Roadmap and Cycles show what is in progress, what is slipping, and what comes next.",
  },
  {
    title: "Beside the work",
    body: "Comments and decisions stay attached to the issue they belong to.",
  },
  {
    title: "A role for everyone",
    body: "Permissions in plain language. Clear access for each role, saved in a few clicks.",
  },
  {
    title: "This moment",
    body: "See activity as it happens. Everything has a shortcut — start from ⌘K.",
  },
]

export function LandingClarity() {
  return (
    <section id="how-it-works" className="bg-apple-tile-2 px-5 py-20 text-white">
      <div className="mx-auto max-w-[980px] text-center">
        <FadeIn inView>
          <h2 className="text-display-lg">
            Clarity without
            <br />
            another meeting.
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-[560px] text-apple-body-muted">
            The workspace is the meeting. Everyone already knows the plan.
          </p>
        </FadeIn>
        <Stagger className="mt-16 grid gap-12 text-left sm:grid-cols-2" delay={0.08}>
          {points.map((point) => (
            <StaggerItem key={point.title}>
              <article>
                <h3 className="text-body-strong text-white">{point.title}</h3>
                <p className="text-body mt-2 text-apple-body-muted">{point.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
