"use client"

import type { ReactNode } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export function Modal({
  open,
  onOpenChange,
  onOpenChangeComplete,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/36 backdrop-blur-[3px] transition-opacity duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 dark:bg-black/56" />
        <Dialog.Viewport className="fixed inset-0 z-[70] grid place-items-center p-3 sm:p-5">
          <Dialog.Popup
            className={cn(
              "relative flex max-h-[min(840px,calc(100vh-2rem))] w-full max-w-[920px] flex-col overflow-hidden rounded-[24px] bg-background outline-none",
              "shadow-[0_0_0_1px_rgb(15_15_15/0.05),0_16px_40px_rgb(15_15_15/0.12)] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.07),0_16px_48px_rgb(0_0_0/0.4)]",
              "origin-center transform-gpu transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] data-starting-style:translate-y-2 data-starting-style:scale-[0.985] data-starting-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:scale-[0.985] data-ending-style:opacity-0",
              className
            )}
          >
            <div className="flex h-12 shrink-0 items-center justify-end px-4">
              <Dialog.Close
                aria-label="Close"
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-black/6 hover:text-foreground dark:hover:bg-white/8"
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
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
