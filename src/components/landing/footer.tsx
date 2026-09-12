import { NexusLogo } from "@/components/brand/nexus-mark"

const columns = [
  {
    title: "Product",
    links: [
      { href: "#product", label: "Issues" },
      { href: "#product", label: "Knowledge" },
      { href: "#how-it-works", label: "Roadmap" },
      { href: "#security", label: "Security" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#top", label: "About" },
      { href: "#top", label: "Contact" },
      { href: "#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#top", label: "Privacy" },
      { href: "#top", label: "Terms" },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer id="pricing" className="bg-muted px-5 py-16">
      <div className="mx-auto max-w-[980px]">
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[14px] font-semibold tracking-[-0.224px] text-apple-ink">
                {column.title}
              </p>
              <nav className="mt-3 flex flex-col text-[17px] leading-[2.41] text-apple-ink-muted-80">
                {column.links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3">
          <NexusLogo className="text-foreground h-3.5" />
          <p className="text-fine text-muted-foreground">© 2026 Nexus</p>
        </div>
      </div>
    </footer>
  )
}
