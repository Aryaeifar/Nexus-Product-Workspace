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
          "pointer-events-none absolute start-full top-1/2 z-50 ms-3 -translate-y-1/2",
          "rounded-lg bg-foreground px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-background",
          "opacity-0 shadow-[0_8px_24px_rgb(0_0_0/0.18)] transition-opacity duration-150 group-hover:opacity-100"
        )}
      >
        {label}
      </span>
    </span>
  )
}
