"use client"

import type { ComponentType } from "react"
import {
  BookOpen,
  Home,
  Inbox,
  LayoutGrid,
  Map,
  PanelLeft,
  Search,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NexusIcon, NexusLogo } from "@/components/brand/nexus-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { Highlighter } from "@/components/ui/highlighter"
import { SidebarTooltip } from "@/components/workspace/sidebar-tooltip"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/home#inbox", label: "Inbox", icon: Inbox, badge: "3" },
  { href: "/home#issues", label: "Issues", icon: LayoutGrid },
  { href: "/home#knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/home#roadmap", label: "Roadmap", icon: Map },
]

const STORAGE_KEY = "nexus.sidebar.collapsed"

export function WorkspaceSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [activeHref, setActiveHref] = useState("/home")

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") setCollapsed(true)
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    setActiveHref(hash ? `${pathname}${hash}` : pathname)
  }, [pathname])

  function toggle() {
    setCollapsed((current) => {
      const next = !current
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <aside
      className={cn(
        "text-sidebar-foreground flex h-svh shrink-0 flex-col bg-sidebar",
        "transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        collapsed ? "w-[72px]" : "w-[268px]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 pt-4 pb-3",
          collapsed && "flex-col px-2"
        )}
      >
        <Link
          href="/home"
          className={cn(
            "flex min-w-0 items-center rounded-xl px-1.5 py-1",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <NexusIcon className="size-5 shrink-0" />
          ) : (
            <NexusLogo className="h-5" />
          )}
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "text-muted-foreground hover:text-sidebar-foreground group relative flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/6 dark:hover:bg-white/8",
            collapsed ? "mt-1" : "ms-auto"
          )}
        >
          <SidebarTooltip enabled={collapsed} label="Expand">
            <PanelLeft
              className={cn(
                "size-4 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </SidebarTooltip>
        </button>
      </div>

      <div className={cn("px-3", collapsed && "flex justify-center px-2")}>
        <Link
          href="/home"
          aria-label="Search"
          className={cn(
            "text-muted-foreground group relative flex items-center justify-center rounded-xl border border-sidebar-border/80 bg-black/[0.03] transition-colors hover:bg-black/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]",
            collapsed ? "size-10" : "h-10 justify-start gap-2 px-3"
          )}
        >
          <SidebarTooltip enabled={collapsed} label="Search">
            <Search className="size-4 shrink-0" />
          </SidebarTooltip>
          {collapsed ? null : (
            <>
              <span className="flex-1 text-[13px]">Search</span>
              <kbd className="rounded-md border border-sidebar-border bg-sidebar px-1.5 py-0.5 text-[10px] tracking-wide text-muted-foreground">
                ⌘K
              </kbd>
            </>
          )}
        </Link>
      </div>

      <nav className={cn("mt-5 flex flex-1 flex-col gap-0.5 px-3", collapsed && "px-2")}>
        {collapsed ? null : (
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Workspace
          </p>
        )}
        {NAV.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            collapsed={collapsed}
            active={activeHref === item.href}
            onSelect={() => setActiveHref(item.href)}
          />
        ))}
      </nav>

      <div className={cn("mt-auto px-3 pb-3", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center rounded-2xl border border-sidebar-border/70 bg-black/[0.03] dark:bg-white/[0.04]",
            collapsed ? "flex-col gap-2 px-1.5 py-2" : "gap-2.5 px-2 py-2"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
            A
          </div>
          {collapsed ? null : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium tracking-[-0.2px]">
                Acme
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Workspace
              </p>
            </div>
          )}
          <ThemeToggle className="text-sidebar-foreground border-sidebar-border size-8 [&_svg]:text-current" />
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({
  href,
  label,
  icon: Icon,
  badge,
  collapsed,
  active,
  onSelect,
}: {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  badge?: string
  collapsed: boolean
  active: boolean
  onSelect: () => void
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
      className={cn(
        "group relative flex items-center overflow-visible rounded-xl text-[13.5px] tracking-[-0.2px] transition-colors",
        collapsed ? "h-10 justify-center" : "min-h-9 gap-2.5 px-2.5 py-1.5",
        active
          ? "font-medium text-sidebar-foreground"
          : "text-muted-foreground hover:text-sidebar-foreground"
      )}
    >
      <SidebarTooltip enabled={collapsed} label={label}>
        {collapsed ? (
          <Highlighter
            action="underline"
            color="#2997ff"
            enabled={active}
            padding={3}
            multiline={false}
          >
            <Icon className="size-[18px] shrink-0" />
          </Highlighter>
        ) : (
          <Icon className="size-[18px] shrink-0" />
        )}
      </SidebarTooltip>
      {collapsed ? null : (
        <span className="min-w-0 overflow-visible">
          <Highlighter
            action="underline"
            color="#2997ff"
            enabled={active}
            padding={4}
            multiline={false}
          >
            {label}
          </Highlighter>
        </span>
      )}
      {collapsed || !badge ? null : (
        <span className="rounded-full bg-foreground/8 px-1.5 text-[10px] font-medium text-muted-foreground">
          {badge}
        </span>
      )}
    </Link>
  )
}
