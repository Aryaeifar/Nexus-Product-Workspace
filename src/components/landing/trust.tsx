const items = [
  { title: "SOC 2 ready", body: "Secure enough for real team work." },
  { title: "Role-based access", body: "Access by role, not by guesswork." },
  { title: "99.9% uptime", body: "Fast, and ready for your team to grow." },
]

export function LandingTrust() {
  return (
    <section id="security" className="border-t border-black/6 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Built for real work
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
