"use client"

import { Search } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { appleDuration, appleEase } from "@/lib/motion"

const nav = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#pricing", label: "Pricing" },
]

export function LandingHeader() {
  const reduced = useReducedMotion()

  return (
    <motion.header
      className="sticky top-0 z-40"
      initial={reduced ? undefined : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: appleDuration.ui, ease: appleEase }}
    >
      <div className="bg-apple-black text-white">
        <div className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-5">
          <a href="#top" className="text-nav">
            Nexus
          </a>
          <nav className="hidden items-center gap-5 md:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-nav text-white/80">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href="#product" aria-label="Search" className="text-white/80">
              <Search className="size-3.5" strokeWidth={1.75} />
            </a>
            <a href="#top" className="text-nav text-white/80">
              Log in
            </a>
          </div>
        </div>
      </div>
      <div className="h-[52px] bg-apple-parchment/80 backdrop-blur-[20px] backdrop-saturate-150">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-5">
          <p className="text-tagline text-apple-ink">Product workspace</p>
          <div className="hidden items-center gap-5 md:flex">
            <a href="#product" className="text-caption text-apple-ink">
              Issues
            </a>
            <a href="#how-it-works" className="text-caption text-apple-ink">
              Knowledge
            </a>
            <a href="#security" className="text-caption text-apple-ink">
              Security
            </a>
            <Button size="sm">Start for free</Button>
          </div>
          <Button size="sm" className="md:hidden">
            Start
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
