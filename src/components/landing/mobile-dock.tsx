"use client"

import { BookOpen, LayoutGrid, Shield } from "lucide-react"

import { NexusIcon } from "@/components/brand/nexus-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dock, DockIcon } from "@/components/ui/dock"

const items = [
  { href: "#product", label: "Product", icon: LayoutGrid },
  { href: "#how-it-works", label: "Knowledge", icon: BookOpen },
  { href: "#security", label: "Security", icon: Shield },
]

export function MobileDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center md:hidden">
      <div className="pointer-events-auto">
        <Dock
          className="mt-0 border-apple-hairline bg-background/80 dark:border-white/10"
          iconSize={36}
          iconMagnification={48}
          direction="middle"
        >
          <DockIcon>
            <a href="#top" aria-label="Home" className="flex size-full items-center justify-center">
              <NexusIcon className="text-foreground size-4" />
            </a>
          </DockIcon>
          {items.map((item) => (
            <DockIcon key={item.label}>
              <a
                href={item.href}
                aria-label={item.label}
                className="text-foreground flex size-full items-center justify-center"
              >
                <item.icon className="size-4" strokeWidth={1.75} />
              </a>
            </DockIcon>
          ))}
          <DockIcon>
            <ThemeToggle className="border-foreground/15 text-foreground size-8" />
          </DockIcon>
        </Dock>
      </div>
    </div>
  )
}
