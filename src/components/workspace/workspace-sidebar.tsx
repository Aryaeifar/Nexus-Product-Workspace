"use client"

import type { ComponentType } from "react"
import {
  BookOpen,
  ChevronRight,
  FolderKanban,
  Home,
  Inbox,
  LayoutGrid,
  Map,
  PanelLeft,
  Plus,
  Search,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useState } from "react"

import { NexusIcon, NexusLogo } from "@/components/brand/nexus-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { Highlighter } from "@/components/ui/highlighter"
import { SidebarTooltip } from "@/components/workspace/sidebar-tooltip"
import { useProjects } from "@/context/projects-context"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/home/inbox", label: "Inbox", icon: Inbox, badge: "3" },
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
    const media = window.matchMedia("(max-width: 720px)")

    function apply() {
      if (media.matches) {
        setCollapsed(true)
        return
      }
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "true")
    }

    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
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
          <div key={item.label}>
            <SidebarItem
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              collapsed={collapsed}
              active={activeHref === item.href}
              onSelect={() => setActiveHref(item.href)}
            />
            {item.label === "Inbox" ? (
              <ProjectsNav collapsed={collapsed} />
            ) : null}
          </div>
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

function ProjectsNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()
  const treeId = useId()
  const { projects, ready, setCreateOpen, treeOpen, setTreeOpen } = useProjects()
  const onProjectRoute = pathname.startsWith("/projekts")

  useEffect(() => {
    if (onProjectRoute) setTreeOpen(true)
  }, [onProjectRoute, setTreeOpen])

  function toggleTree() {
    setTreeOpen(!treeOpen)
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <Link
          href="/projekts"
          aria-label="Projects"
          aria-current={onProjectRoute ? "page" : undefined}
          className={cn(
            "group relative flex size-11 items-center justify-center rounded-xl transition-colors",
            onProjectRoute
              ? "text-sidebar-foreground"
              : "text-[#4a4a4a] hover:text-sidebar-foreground dark:text-[#a1a1a6]"
          )}
        >
          <SidebarTooltip enabled label="Projects">
            <Highlighter
              action="underline"
              color="#2997ff"
              enabled={onProjectRoute}
              padding={3}
              multiline={false}
            >
              <FolderKanban className="size-[18px] shrink-0" />
            </Highlighter>
          </SidebarTooltip>
        </Link>
        <button
          type="button"
          aria-label="Create project"
          onClick={() => setCreateOpen(true)}
          className="flex size-11 items-center justify-center rounded-xl text-[#4a4a4a] transition-colors hover:bg-black/6 hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring dark:text-[#a1a1a6] dark:hover:bg-white/8"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    )
  }

  return (
    <div className="mt-0.5">
      <div
        className={cn(
          "flex min-h-11 items-center justify-between gap-1 rounded-xl px-1.5",
          onProjectRoute && "text-sidebar-foreground"
        )}
      >
        <button
          type="button"
          aria-expanded={treeOpen}
          aria-controls={treeId}
          onClick={toggleTree}
          className={cn(
            "flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg px-1 text-[13.5px] tracking-[-0.2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
            onProjectRoute
              ? "font-medium text-sidebar-foreground"
              : "text-[#4a4a4a] hover:text-sidebar-foreground dark:text-[#a1a1a6]"
          )}
        >
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              treeOpen && "rotate-90"
            )}
            aria-hidden
          />
          <FolderKanban className="size-[18px] shrink-0" aria-hidden />
          <span className="min-w-0 truncate">
            <Highlighter
              action="underline"
              color="#2997ff"
              enabled={onProjectRoute && pathname === "/projekts"}
              padding={4}
              multiline={false}
            >
              Projects
            </Highlighter>
          </span>
        </button>
        <button
          type="button"
          aria-label="Create project"
          onClick={() => setCreateOpen(true)}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[#4a4a4a] transition-colors hover:bg-black/6 hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring dark:text-[#a1a1a6] dark:hover:bg-white/8"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>

      {treeOpen ? (
        <ul id={treeId} className="ms-[18px] mt-0.5 border-s border-sidebar-border ps-3">
          {!ready ? (
            <li className="px-2 py-2 text-[12px] text-[#4a4a4a] dark:text-[#a1a1a6]">
              Loading projects
            </li>
          ) : projects.length === 0 ? (
            <li className="px-2 py-2 text-[12px] text-[#4a4a4a] dark:text-[#a1a1a6]">
              No projects yet
            </li>
          ) : (
            projects.map((project) => {
              const href = `/projekts/${project.slug}`
              const active = pathname === href
              return (
                <li key={project.id}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-2 text-[13px] tracking-[-0.2px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                      active
                        ? "font-medium text-sidebar-foreground"
                        : "text-[#4a4a4a] hover:text-sidebar-foreground dark:text-[#a1a1a6]"
                    )}
                  >
                    <Highlighter
                      action="underline"
                      color="#2997ff"
                      enabled={active}
                      padding={4}
                      multiline={false}
                    >
                      {project.name}
                    </Highlighter>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
