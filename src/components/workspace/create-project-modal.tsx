"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { Modal } from "@/components/ui/modal"
import { useProjects } from "@/context/projects-context"
import { cn } from "@/lib/utils"

export function CreateProjectModal() {
  const router = useRouter()
  const { createOpen, setCreateOpen, createProject } = useProjects()
  const nameId = useId()
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!createOpen) return
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [createOpen])

  function reset() {
    setName("")
    setError("")
  }

  function handleOpenChange(open: boolean) {
    setCreateOpen(open)
    if (!open) reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = createProject(name)
    if ("error" in result) {
      setError(result.error)
      return
    }

    handleOpenChange(false)
    router.push(`/projekts/${result.project.slug}`)
  }

  return (
    <Modal
      open={createOpen}
      onOpenChange={handleOpenChange}
      title="Create project"
      className="max-w-[420px] rounded-[18px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 pb-6">
        <div>
          <p className="text-[21px] font-semibold tracking-[-0.3px] text-foreground">
            Create project
          </p>
          <p className="mt-1 text-[14px] leading-snug text-[#4a4a4a] dark:text-[#a1a1a6]">
            The name becomes the project URL under /projekts.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-[13px] font-medium text-foreground">
            Project name
          </label>
          <input
            ref={inputRef}
            id={nameId}
            name="project-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError("")
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder="Launch board"
            className={cn(
              "h-11 rounded-[11px] border bg-background px-3 text-[15px] text-foreground outline-none",
              "placeholder:text-[#5c5c5c] dark:placeholder:text-[#a1a1a6]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              error
                ? "border-destructive"
                : "border-input"
            )}
          />
          {error ? (
            <p id={errorId} role="alert" className="text-[13px] text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-[11px] px-4 text-[14px] text-foreground transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:bg-white/8"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-apple-primary px-5 text-[14px] text-white transition-colors hover:bg-apple-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-primary-focus"
          >
            Create project
          </button>
        </div>
      </form>
    </Modal>
  )
}
