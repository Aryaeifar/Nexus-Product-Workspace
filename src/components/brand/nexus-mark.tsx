import { cn } from "@/lib/utils"

export function NexusLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 86 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[13px] w-auto", className)}
      aria-label="NEXUS"
      role="img"
    >
      <title>NEXUS</title>
      <text
        x="0"
        y="12"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="-0.8"
      >
        NEXUS
      </text>
    </svg>
  )
}

export function NexusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      aria-hidden
    >
      <text
        x="1"
        y="13"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="14"
        fontWeight="600"
      >
        N
      </text>
    </svg>
  )
}
