"use client"

import {
  BookOpen,
  FileText,
  Home,
  Inbox,
  LayoutGrid,
  Map,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useState } from "react"

import { NexusIcon } from "@/components/brand/nexus-mark"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

const SEGMENT_LABELS: Record<string, string> = {
  home: "Home",
  inbox: "Inbox",
}

const SEGMENT_ICONS: Record<string, LucideIcon> = {
  home: Home,
  inbox: Inbox,
}

const HASH_SECTIONS: Record<string, { label: string; icon: LucideIcon }> = {
  issues: { label: "Issues", icon: LayoutGrid },
  knowledge: { label: "Knowledge", icon: BookOpen },
  roadmap: { label: "Roadmap", icon: Map },
}

function labelForSegment(segment: string) {
  return (
    SEGMENT_LABELS[segment] ??
    segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  )
}

function iconForSegment(segment: string) {
  return SEGMENT_ICONS[segment] ?? FileText
}

type Crumb = {
  id: string
  href: string
  label: string
  icon: LucideIcon | typeof NexusIcon
}

const WORKSPACE_CRUMB: Crumb = {
  id: "workspace",
  href: "/home",
  label: "Workspace",
  icon: LayoutGrid,
}

function crumbsForLocation(pathname: string, hash: string): Crumb[] {
  if (pathname === "/") {
    return [{ id: "nexus", href: "/", label: "Nexus", icon: NexusIcon }]
  }

  if (!pathname.startsWith("/home")) {
    const segments = pathname.split("/").filter(Boolean)
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      return {
        id: `segment-${segment}`,
        href,
        label: labelForSegment(segment),
        icon: iconForSegment(segment),
      }
    })
  }

  const items: Crumb[] = [WORKSPACE_CRUMB]
  const childSegments = pathname.split("/").filter(Boolean).slice(1)

  if (childSegments.length > 0) {
    let href = "/home"
    for (const segment of childSegments) {
      href += `/${segment}`
      items.push({
        id: `segment-${segment}`,
        href,
        label: labelForSegment(segment),
        icon: iconForSegment(segment),
      })
    }
    return items
  }

  const sectionKey = hash.replace(/^#/, "")
  const section = HASH_SECTIONS[sectionKey]
  if (section) {
    items.push({
      id: `hash-${sectionKey}`,
      href: `/home#${sectionKey}`,
      label: section.label,
      icon: section.icon,
    })
    return items
  }

  items.push({
    id: "home",
    href: "/home",
    label: "Home",
    icon: Home,
  })
  return items
}

function CrumbContent({
  icon: Icon,
  label,
}: {
  icon: Crumb["icon"]
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
      <span>{label}</span>
    </span>
  )
}

export function PageBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const [hash, setHash] = useState("")

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash)
    }

    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [pathname])

  const crumbs = crumbsForLocation(pathname, hash)
  const lastIndex = crumbs.length - 1

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.id}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {index === lastIndex ? (
                <BreadcrumbPage>
                  <CrumbContent icon={crumb.icon} label={crumb.label} />
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>
                  <CrumbContent icon={crumb.icon} label={crumb.label} />
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
