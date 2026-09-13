import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SidebarTooltip({
  label,
  enabled,
  children,
}: {
  label: string
  enabled: boolean
  children: ReactNode
}) {
  if (!enabled) return children

  return (
    <span className="relative flex items-center justify-center">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute start-full top-1/2 z-50 ms-2 -translate-y-1/2",
          "rounded-md bg-apple-ink px-2 py-1 text-[12px] whitespace-nowrap text-white",
          "opacity-0 transition-opacity group-hover:opacity-100"
        )}
      >
        {label}
      </span>
    </span>
  )
}
