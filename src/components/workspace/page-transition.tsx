"use client"

import { usePathname } from "next/navigation"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

function isPageNavigation(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false
  if (anchor.hasAttribute("download")) return false
  const href = anchor.getAttribute("href")
  if (!href || href.startsWith("#")) return false

  let next: URL
  try {
    next = new URL(anchor.href, location.href)
  } catch {
    return false
  }

  if (next.origin !== location.origin) return false
  return (
    next.pathname !== location.pathname || next.search !== location.search
  )
}

function snapshotPage(live: HTMLElement) {
  const clone = live.cloneNode(true) as HTMLElement
  clone.classList.remove("page-enter")
  clone.scrollTop = live.scrollTop
  clone.scrollLeft = live.scrollLeft
  return clone
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const liveRef = useRef<HTMLDivElement>(null)
  const leaveRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef(pathname)
  const pendingClone = useRef<HTMLElement | null>(null)
  const [leavingNode, setLeavingNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    pathRef.current = pathname
  }, [pathname])

  useLayoutEffect(() => {
    const clone = pendingClone.current
    if (!clone) return
    pendingClone.current = null
    setLeavingNode(clone)
  }, [pathname])

  useEffect(() => {
    function capture(live: HTMLElement | null) {
      if (!live) return
      pendingClone.current = snapshotPage(live)
    }

    function onClick(event: MouseEvent) {
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isPageNavigation(anchor)) return
      capture(liveRef.current)
    }

    function onPopState() {
      if (location.pathname === pathRef.current) return
      capture(liveRef.current)
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("popstate", onPopState, true)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("popstate", onPopState, true)
    }
  }, [])

  useLayoutEffect(() => {
    const host = leaveRef.current
    if (!host || !leavingNode) return
    host.replaceChildren(leavingNode)
  }, [leavingNode])

  useEffect(() => {
    if (!leavingNode) return
    const timeout = window.setTimeout(() => setLeavingNode(null), 450)
    return () => window.clearTimeout(timeout)
  }, [leavingNode])

  function onLeaveEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    if (event.animationName !== "page-leave") return
    setLeavingNode(null)
  }

  return (
    <div className="relative h-full">
      {leavingNode ? (
        <div
          ref={leaveRef}
          inert
          onAnimationEnd={onLeaveEnd}
          className="page-leave pointer-events-none absolute inset-0 z-10 overflow-hidden bg-background"
        />
      ) : null}
      <div
        ref={liveRef}
        key={pathname}
        className={cn(
          "h-full overflow-y-auto bg-background",
          leavingNode && "page-enter"
        )}
      >
        {children}
      </div>
    </div>
  )
}
