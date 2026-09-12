import { Marquee } from "@/components/ui/marquee"

const teams = [
  "Acme",
  "Northwind",
  "Helios",
  "Orbit",
  "Lumen",
  "Cascade",
  "Vesper",
  "Atlas",
]

export function LogoMarquee() {
  return (
    <section className="relative bg-muted py-10">
      <p className="text-caption mb-5 text-center text-muted-foreground">
        Trusted by 2,400+ teams of every size
      </p>
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:32s] [--gap:2.5rem]">
          {teams.map((team) => (
            <span
              key={team}
              className="text-tagline text-foreground/70 px-2 tracking-tight"
            >
              {team}
            </span>
          ))}
        </Marquee>
        <div className="from-muted pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r to-transparent" />
        <div className="from-muted pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l to-transparent" />
      </div>
    </section>
  )
}
