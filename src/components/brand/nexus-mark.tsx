import { cn } from "@/lib/utils"

const markMask = {
  WebkitMaskImage: "url(/brand/nexus-wordmark.png)",
  maskImage: "url(/brand/nexus-wordmark.png)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
} as const

export function NexusLogo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="NEXUS"
      className={cn("inline-block h-5 aspect-[578/173] bg-current", className)}
      style={markMask}
    />
  )
}

export function NexusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5", className)}
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.4">
        <path d="M4 16 H13.1" />
        <path d="M18.9 16 H28" />
        <path d="M16 12.2 L19.8 16 L16 19.8 L12.2 16 Z" />
      </g>
    </svg>
  )
}
