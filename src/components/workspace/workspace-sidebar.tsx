"use client"

import type { ComponentType } from "react"
import {
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Inbox,
  LayoutGrid,
  Map,
  Search,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NexusIcon, NexusLogo } from "@/components/brand/nexus-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTooltip } from "@/components/workspace/sidebar-tooltip"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/home#inbox", label: "Inbox", icon: Inbox },
  { href: "/home#issues", label: "Issues", icon: LayoutGrid },
  { href: "/home#knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/home#roadmap", label: "Roadmap", icon: Map },
]

const STORAGE_KEY = "nexus.sidebar.collapsed"

export function WorkspaceSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "true") setCollapsed(true)
  }, [])

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
        "bg-sidebar text-sidebar-foreground flex h-svh shrink-0 flex-col border-e border-sidebar-border transition-[width] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        collapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      <div
        className={cn(
          "flex h-12 items-center gap-2 px-2",
          collapsed && "justify-center"
        )}
      >
        <Link
          href="/home"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <NexusIcon className="size-5 shrink-0" />
          ) : (
            <NexusLogo className="h-5" />
          )}
        </Link>
        {collapsed ? null : (
          <button
            type="button"
            onClick={toggle}
            aria-label="Collapse sidebar"
            className="text-muted-foreground ms-auto rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/8"
          >
            <ChevronsLeft className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 pt-1">
        <SidebarItem
          href="/home"
          label="Search"
          icon={Search}
          collapsed={collapsed}
          active={false}
        />
        {NAV.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            active={item.href === "/home" && pathname === "/home"}
          />
        ))}
      </nav>

      <div
        className={cn(
          "flex items-center gap-2 border-t border-sidebar-border p-2",
          collapsed && "flex-col"
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Expand sidebar"
            className="group relative flex size-9 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/8"
          >
            <SidebarTooltip enabled label="Expand">
              <ChevronsRight className="size-4" />
            </SidebarTooltip>
          </button>
        ) : null}
        <ThemeToggle className="border-foreground/15 text-foreground size-8" />
      </div>
    </aside>
  )
}

function SidebarItem({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
}: {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  collapsed: boolean
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "group relative flex items-center rounded-md text-[14px] tracking-[-0.2px]",
        collapsed ? "h-9 justify-center" : "h-8 gap-2 px-2",
        active
          ? "bg-black/6 font-semibold dark:bg-white/10"
          : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8"
      )}
    >
          <SidebarTooltip enabled={collapsed} label={label}>
        <Icon className="size-4 shrink-0" />
      </SidebarTooltip>
      {collapsed ? null : <span className="truncate">{label}</span>}
    </Link>
  )
}
