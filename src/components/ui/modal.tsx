"use client"

import type { ReactNode } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[24px] backdrop-saturate-150 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] data-closed:opacity-0 data-closed:backdrop-blur-none dark:bg-black/45" />
        <Dialog.Viewport className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-6">
          <Dialog.Popup
            className={cn(
              "relative flex max-h-[min(860px,calc(100vh-2rem))] w-full max-w-[680px] flex-col overflow-hidden rounded-[22px] bg-background/92 outline-none backdrop-blur-xl",
              "shadow-[0_0_0_1px_rgb(15_15_15/0.06),0_24px_80px_rgb(15_15_15/0.16)] dark:bg-background/80 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_28px_90px_rgb(0_0_0/0.55)]",
              "origin-center duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[0.97] data-open:slide-in-from-bottom-3 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[0.98] data-closed:slide-out-to-bottom-2",
              className
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgb(255_255_255/0.38),transparent)] dark:bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent)]"
            />
            <div className="relative flex items-center justify-between px-5 pt-4 pb-2">
              <p className="text-[12px] tracking-[0.04em] text-muted-foreground uppercase">
                Task
              </p>
              <Dialog.Close
                aria-label="Close"
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-black/5 hover:text-foreground active:scale-95 dark:hover:bg-white/8"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>
            ) : null}
            <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
              {children}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
