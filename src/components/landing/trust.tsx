import { FadeIn, Stagger, StaggerItem } from "@/components/landing/fade-in"

const items = [
  { title: "SOC 2 ready", body: "Secure enough for real team work." },
  { title: "Role-based access", body: "Access by role, not by guesswork." },
  { title: "99.9% uptime", body: "Fast, and ready for your team to grow." },
]

export function LandingTrust() {
  return (
    <section id="security" className="bg-apple-canvas px-5 py-20">
      <div className="mx-auto max-w-[980px] text-center">
        <FadeIn inView>
          <h2 className="text-display-lg">Built for real work.</h2>
          <p className="text-lead mx-auto mt-4 max-w-[520px] text-apple-ink">
            Security and access that stay out of the way until you need them.
          </p>
        </FadeIn>
        <Stagger className="mt-16 grid gap-12 text-left sm:grid-cols-3">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <div>
                <h3 className="text-body-strong">{item.title}</h3>
                <p className="text-body mt-2 text-apple-ink-muted-48">{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
