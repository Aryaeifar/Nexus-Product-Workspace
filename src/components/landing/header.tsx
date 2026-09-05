import { Button } from "@/components/ui/button"

const nav = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#pricing", label: "Pricing" },
]

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[color-mix(in_oklch,var(--background)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-heading text-[15px] font-semibold tracking-tight">
          Nexus<span className="text-muted-foreground">.Product Workspace</span>
        </a>
        <nav className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button size="sm">Start for free</Button>
        </div>
      </div>
    </header>
  )
}
