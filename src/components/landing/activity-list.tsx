"use client"

import { AnimatedList } from "@/components/ui/animated-list"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { cn } from "@/lib/utils"

const events = [
  {
    name: "PRD-142 moved to In review",
    description: "Maya finalized the onboarding flow",
    time: "2m",
    icon: "↗",
    color: "#0066cc",
  },
  {
    name: "Cycle 24 started",
    description: "12 issues pulled into this week",
    time: "18m",
    icon: "●",
    color: "#1d1d1f",
  },
  {
    name: "Comment on ENG-204",
    description: "Alex: timeline is ready to merge",
    time: "36m",
    icon: "💬",
    color: "#2997ff",
  },
  {
    name: "Knowledge page updated",
    description: "Permissions model — nested page",
    time: "1h",
    icon: "⌘",
    color: "#333333",
  },
  {
    name: "DS-038 assigned to you",
    description: "Build command menu states",
    time: "2h",
    icon: "N",
    color: "#0066cc",
  },
]

function EventCard({
  name,
  description,
  icon,
  color,
  time,
}: (typeof events)[number]) {
  return (
    <figure
      className={cn(
        "relative w-full max-w-[360px] overflow-hidden rounded-[18px] border border-apple-hairline bg-background p-4 dark:border-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <figcaption className="text-caption truncate font-semibold text-foreground">
            {name}
          </figcaption>
          <p className="text-caption truncate text-muted-foreground">{description}</p>
        </div>
        <span className="text-fine text-muted-foreground">{time}</span>
      </div>
    </figure>
  )
}

export function ActivityList({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-[280px] overflow-hidden", className)}>
      <AnimatedList delay={1800} className="items-stretch px-2">
        {events.map((event) => (
          <EventCard {...event} key={event.name} />
        ))}
      </AnimatedList>
      <ProgressiveBlur position="bottom" height="42%" />
    </div>
  )
}
