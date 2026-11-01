"use client"

import Link from "next/link"

import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useProjects } from "@/context/projects-context"

export function ProjectPage({ slug }: { slug?: string }) {
  const { ready, projects, projectBySlug, setCreateOpen } = useProjects()

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!slug) {
    if (projects.length === 0) {
      return (
        <>
          <h1 className="sr-only">Projects</h1>
          <EmptyState
            title="No projects yet"
            highlight="projects"
            description="Create a project from the plus control next to Projects in the sidebar."
            action={
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex h-11 items-center justify-center rounded-full bg-apple-primary px-5 text-[14px] text-white transition-colors hover:bg-apple-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-primary-focus"
              >
                Create project
              </button>
            }
          />
        </>
      )
    }

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-[28px] font-semibold tracking-[-0.4px] text-foreground">
          Projects
        </h1>
        <ul className="divide-y divide-border rounded-[14px] border border-border">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projekts/${project.slug}`}
                className="flex min-h-11 items-center justify-between gap-3 px-4 py-3 text-[15px] text-foreground transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:bg-white/[0.05]"
              >
                <span className="truncate">{project.name}</span>
                <span className="shrink-0 text-[12px] text-[#4a4a4a] dark:text-[#a1a1a6]">
                  /projekts/{project.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const project = projectBySlug(slug)
  if (!project) {
    return (
      <>
        <h1 className="sr-only">Project not found</h1>
        <EmptyState
          title="Project not found"
          highlight="not found"
          description="This URL does not match a project in this workspace."
          action={
            <Link
              href="/projekts"
              className="inline-flex h-11 items-center justify-center rounded-full bg-apple-primary px-5 text-[14px] text-white transition-colors hover:bg-apple-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-primary-focus"
            >
              Back to projects
            </Link>
          }
        />
      </>
    )
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-3 p-6 sm:p-8">
      <p className="text-[13px] whitespace-nowrap text-[#4a4a4a] dark:text-[#a1a1a6]">
        /projekts/{project.slug}
      </p>
      <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-foreground">
        {project.name}
      </h1>
      <p className="max-w-lg text-[16px] leading-relaxed text-[#4a4a4a] dark:text-[#a1a1a6]">
        This project is ready. Tasks and files for it will live on this page.
      </p>
    </div>
  )
}
