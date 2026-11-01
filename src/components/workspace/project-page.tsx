"use client"

import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"

import { EmptyState } from "@/components/ui/empty-state"
import { Highlighter } from "@/components/ui/highlighter"
import { Spinner } from "@/components/ui/spinner"
import { ProjectBoard } from "@/components/workspace/project-board"
import { useProjects } from "@/context/projects-context"
import { appleDuration, appleEase } from "@/lib/motion"

export function ProjectPage({ slug }: { slug?: string }) {
  const { ready, projects, projectBySlug, setCreateOpen } = useProjects()
  const reduced = useReducedMotion()

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
      <motion.div
        className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6 sm:p-8"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: appleDuration.ui, ease: appleEase }}
      >
        <h1 className="text-[clamp(24px,4vw,28px)] font-semibold tracking-[-0.4px] text-foreground">
          <Highlighter action="highlight" color="#cce4ff" isView>
            Projects
          </Highlighter>
        </h1>
        <ul className="divide-y divide-border overflow-hidden rounded-[14px] border border-border">
          {projects.map((project, index) => (
            <motion.li
              key={project.id}
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: appleDuration.ui,
                delay: reduced ? 0 : index * 0.05,
                ease: appleEase,
              }}
            >
              <Link
                href={`/projekts/${project.slug}`}
                className="flex min-h-11 items-center justify-between gap-3 px-4 py-3 text-[15px] text-foreground transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:bg-white/[0.05]"
              >
                <span className="truncate">{project.name}</span>
                <span className="shrink-0 text-[12px] text-[#4a4a4a] dark:text-[#a1a1a6]">
                  /projekts/{project.slug}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
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
    <ProjectBoard
      projectId={project.id}
      projectName={project.name}
      projectSlug={project.slug}
    />
  )
}
