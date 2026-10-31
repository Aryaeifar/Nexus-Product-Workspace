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
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[24px] backdrop-saturate-150 transition-all duration-200 data-closed:opacity-0 dark:bg-black/45" />
        <Dialog.Viewport className="fixed inset-0 z-[70] grid place-items-center p-4">
          <Dialog.Popup
            className={cn(
              "flex max-h-[min(820px,calc(100vh-2rem))] w-full max-w-[640px] flex-col overflow-hidden rounded-[12px] bg-background shadow-[0_0_0_1px_rgb(15_15_15/0.05),0_8px_24px_rgb(15_15_15/0.08)] outline-none dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_16px_40px_rgb(0_0_0/0.45)]",
              "origin-center duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              className
            )}
          >
            <div className="flex items-center justify-end px-3 pt-3">
              <Dialog.Close
                aria-label="Close"
                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/4 hover:text-foreground dark:hover:bg-white/6"
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
            <div className="min-h-0 flex-1 overflow-y-auto px-10 pb-10">
              {children}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
