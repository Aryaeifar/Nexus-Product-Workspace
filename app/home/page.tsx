import type { Metadata } from "next"

import { GettingStarted } from "@/components/workspace/getting-started"

export const metadata: Metadata = {
  title: "Home — Nexus",
  description:
    "Your getting started page. Write, check off, duplicate, recolor, and reorder.",
}

export default function HomePage() {
  return <GettingStarted />
}
