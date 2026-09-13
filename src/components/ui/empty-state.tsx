"use client"

import type { ReactNode } from "react"

import { Highlighter } from "@/components/ui/highlighter"
import { cn } from "@/lib/utils"

export function EmptyState({
  icon,
  title,
  highlight,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  highlight?: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  const highlighted = highlight ?? title

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      {icon ? (
        <div className="text-muted-foreground mb-4 [&_svg]:size-10">{icon}</div>
      ) : null}
      <h2 className="text-display-md text-foreground">
        {title.includes(highlighted) ? (
          <>
            {title.slice(0, title.indexOf(highlighted))}
            <Highlighter action="highlight" color="#cce4ff" isView>
              {highlighted}
            </Highlighter>
            {title.slice(title.indexOf(highlighted) + highlighted.length)}
          </>
        ) : (
          title
        )}
      </h2>
      {description ? (
        <p className="text-body text-muted-foreground mt-3 max-w-md">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
