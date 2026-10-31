"use client"

import { AnimatePresence } from "motion/react"
import {
  Calendar,
  CircleDot,
  Clock3,
  Flag,
  Plus,
  RotateCcw,
  Tag,
  Timer,
  UserRound,
  X,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { AnimatedListItem } from "@/components/ui/animated-list"
import { Modal } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

export const TASK_STATUSES = [
  {
    id: "todo",
    label: "Todo",
    swatch: "bg-zinc-400",
    chip: "bg-zinc-500/12 text-zinc-700 dark:text-zinc-300",
    chipActive: "bg-zinc-600 text-white",
  },
  {
    id: "in_progress",
    label: "In Progress",
    swatch: "bg-sky-500",
    chip: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
    chipActive: "bg-sky-500 text-white",
  },
  {
    id: "done",
    label: "Done",
    swatch: "bg-green-500",
    chip: "bg-green-500/12 text-green-700 dark:text-green-300",
    chipActive: "bg-green-600 text-white",
  },
  {
    id: "canceled",
    label: "Canceled",
    swatch: "bg-red-500",
    chip: "bg-red-500/12 text-red-700 dark:text-red-300",
    chipActive: "bg-red-500 text-white",
  },
] as const

export const TASK_PRIORITIES = [
  { id: "none", label: "No priority", swatch: "bg-zinc-400" },
  { id: "urgent", label: "Urgent", swatch: "bg-red-500" },
  { id: "high", label: "High", swatch: "bg-orange-500" },
  { id: "medium", label: "Medium", swatch: "bg-amber-400" },
  { id: "low", label: "Low", swatch: "bg-sky-500" },
] as const

export const TASK_LABELS = ["Bug", "Feature", "Design", "Launch"] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]["id"]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]["id"]

export type TaskSubtask = {
  id: string
  title: string
  done: boolean
}

export type TaskDetails = {
  id: string
  title: string
  done: boolean
  elapsedMs: number
  status: TaskStatus
  priority: TaskPriority
  description: string
  assignee: string
  dueDate: string
  estimate: number | null
  labels: string[]
  subtasks: TaskSubtask[]
  createdAt: number
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return TASK_STATUSES.some((status) => status.id === value)
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return TASK_PRIORITIES.some((priority) => priority.id === value)
}

export function createSubtask(title = ""): TaskSubtask {
  return { id: crypto.randomUUID(), title, done: false }
}

export function TaskDetailModal({
  open,
  task,
  elapsedMs,
  running = false,
  startedAt = null,
  onOpenChange,
  onOpenChangeComplete,
  onChange,
  onResetTime,
}: {
  open: boolean
  task: TaskDetails
  elapsedMs: number
  running?: boolean
  startedAt?: number | null
  onOpenChange: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  onChange: (patch: Partial<TaskDetails>) => void
  onResetTime: () => void
}) {
  const [labelDraft, setLabelDraft] = useState("")
  const [now, setNow] = useState(() => Date.now())
  const focusId = useRef<string | null>(null)
  const heading = task.title.trim() || "Untitled"
  const liveElapsed =
    open && running && startedAt != null
      ? elapsedMs + Math.max(0, now - startedAt)
      : elapsedMs

  useEffect(() => {
    if (!open || !running) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [open, running, startedAt])
  const doneCount = task.subtasks.filter((item) => item.done).length
  const progress =
    task.subtasks.length === 0 ? 0 : doneCount / task.subtasks.length

  function addLabel(label: string) {
    const next = label.trim()
    if (!next || task.labels.includes(next)) return
    onChange({ labels: [...task.labels, next] })
    setLabelDraft("")
  }

  function addSubtask(afterId?: string) {
    const next = createSubtask()
    focusId.current = next.id
    if (!afterId) {
      onChange({ subtasks: [...task.subtasks, next] })
      return
    }
    const index = task.subtasks.findIndex((item) => item.id === afterId)
    const copy = [...task.subtasks]
    copy.splice(index + 1, 0, next)
    onChange({ subtasks: copy })
  }

  function updateSubtask(id: string, patch: Partial<TaskSubtask>) {
    onChange({
      subtasks: task.subtasks.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    })
  }

  function removeSubtask(id: string) {
    onChange({ subtasks: task.subtasks.filter((item) => item.id !== id) })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      title={heading}
      description="Task details"
    >
      <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 px-7 pb-10 sm:px-10">
          <input
            value={task.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="Task title"
            className="w-full bg-transparent text-[28px] leading-[1.15] font-semibold tracking-[-0.56px] text-foreground outline-none placeholder:text-muted-foreground/40"
          />

          <div className="mt-6 flex flex-col gap-4">
            <Property label="Status" icon={<CircleDot className="size-3.5" />}>
              <div
                role="radiogroup"
                aria-label="Status"
                className="flex flex-wrap gap-1.5"
              >
                {TASK_STATUSES.map((status) => (
                  <ChoiceChip
                    key={status.id}
                    pressed={task.status === status.id}
                    idleClass={status.chip}
                    activeClass={status.chipActive}
                    onClick={() =>
                      onChange({
                        status: status.id,
                        done: status.id === "done",
                      })
                    }
                  >
                    <span className={cn("size-1.5 rounded-full", status.swatch)} />
                    {status.label}
                  </ChoiceChip>
                ))}
              </div>
            </Property>

            <Property label="Priority" icon={<Flag className="size-3.5" />}>
              <div
                role="radiogroup"
                aria-label="Priority"
                className="flex flex-wrap gap-1.5"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <ChoiceChip
                    key={priority.id}
                    pressed={task.priority === priority.id}
                    onClick={() => onChange({ priority: priority.id })}
                  >
                    <span
                      className={cn("size-1.5 rounded-full", priority.swatch)}
                    />
                    {priority.label}
                  </ChoiceChip>
                ))}
              </div>
            </Property>
          </div>

          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.2px] text-foreground">
                  Checklist
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {task.subtasks.length === 0
                    ? "Break the work into smaller steps"
                    : `${doneCount} of ${task.subtasks.length} complete`}
                </p>
              </div>
            </div>
            {task.subtasks.length > 0 ? (
              <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
                <div
                  className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-0.5">
              <AnimatePresence initial={false} mode="popLayout">
                {task.subtasks.map((item) => (
                  <AnimatedListItem key={item.id}>
                    <ChecklistRow
                      item={item}
                      autoFocus={focusId.current === item.id}
                      onFocused={() => {
                        if (focusId.current === item.id) focusId.current = null
                      }}
                      onToggle={() =>
                        updateSubtask(item.id, { done: !item.done })
                      }
                      onChange={(title) => updateSubtask(item.id, { title })}
                      onDelete={() => removeSubtask(item.id)}
                      onEnter={() => addSubtask(item.id)}
                      onEmptyBackspace={() => removeSubtask(item.id)}
                    />
                  </AnimatedListItem>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => addSubtask()}
              className="mt-1 flex h-9 w-full items-center gap-2 rounded-lg px-2 text-[14px] text-muted-foreground transition-colors hover:bg-black/[0.035] dark:hover:bg-white/[0.05]"
            >
              <Plus className="size-3.5" />
              Add a subtask
            </button>
          </section>

          <textarea
            value={task.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="Add a description…"
            rows={4}
            className="mt-10 w-full resize-none bg-transparent text-[15px] leading-6 text-foreground/85 outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <aside className="border-t border-black/6 px-7 py-8 sm:px-10 lg:border-t-0 lg:border-l lg:px-7 lg:py-1 dark:border-white/8">
          <div className="divide-y divide-black/6 dark:divide-white/8">
            <Property label="Assignee" icon={<UserRound className="size-3.5" />}>
              <input
                value={task.assignee}
                onChange={(event) => onChange({ assignee: event.target.value })}
                placeholder="Unassigned"
                aria-label="Assignee"
                className={fieldClass}
              />
            </Property>

            <Property label="Due date" icon={<Calendar className="size-3.5" />}>
              <input
                type="date"
                value={task.dueDate}
                onChange={(event) => onChange({ dueDate: event.target.value })}
                aria-label="Due date"
                className={fieldClass}
              />
            </Property>

            <Property label="Estimate" icon={<Timer className="size-3.5" />}>
              <input
                type="number"
                min={0}
                step={0.5}
                value={task.estimate ?? ""}
                onChange={(event) =>
                  onChange({
                    estimate:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  })
                }
                placeholder="0h"
                aria-label="Estimate"
                className={fieldClass}
              />
            </Property>

            <Property label="Tracked" icon={<Clock3 className="size-3.5" />}>
              <div className="flex h-8 items-center justify-between gap-2">
                <p className="font-mono text-[13px] tabular-nums text-foreground">
                  {formatTaskTime(liveElapsed)}
                </p>
                <button
                  type="button"
                  onClick={onResetTime}
                  disabled={liveElapsed <= 0}
                  aria-label="Reset time"
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/8"
                >
                  <RotateCcw className="size-3" />
                  Reset
                </button>
              </div>
            </Property>

            <Property label="Labels" icon={<Tag className="size-3.5" />}>
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      onChange({
                        labels: task.labels.filter((item) => item !== label),
                      })
                    }
                    className="rounded-full bg-black/6 px-2.5 py-1 text-[12px] text-foreground transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/14"
                  >
                    {label}
                  </button>
                ))}
                <input
                  value={labelDraft}
                  onChange={(event) => setLabelDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addLabel(labelDraft)
                    }
                  }}
                  placeholder="Add label"
                  aria-label="Add label"
                  className="min-w-[76px] flex-1 bg-transparent py-1 text-[13px] outline-none placeholder:text-muted-foreground/55"
                />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {TASK_LABELS.filter((label) => !task.labels.includes(label)).map(
                  (label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => addLabel(label)}
                      className="rounded-full px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </Property>
          </div>

          <p className="mt-8 text-[12px] text-muted-foreground">
            Created {formatCreated(task.createdAt)}
          </p>
        </aside>
      </div>
    </Modal>
  )
}

function ChecklistRow({
  item,
  autoFocus,
  onFocused,
  onToggle,
  onChange,
  onDelete,
  onEnter,
  onEmptyBackspace,
}: {
  item: TaskSubtask
  autoFocus: boolean
  onFocused: () => void
  onToggle: () => void
  onChange: (title: string) => void
  onDelete: () => void
  onEnter: () => void
  onEmptyBackspace: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    inputRef.current?.focus()
    onFocused()
  }, [autoFocus, onFocused])

  return (
    <div className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          item.done ? "Mark subtask incomplete" : "Mark subtask complete"
        }
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-foreground/80 bg-background text-background",
          item.done && "bg-foreground text-background"
        )}
      >
        {item.done ? (
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
            <path
              d="M2.5 6.2 5 8.6 9.5 3.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </button>
      <input
        ref={inputRef}
        value={item.title}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            onEnter()
          }
          if (event.key === "Backspace" && item.title === "") {
            event.preventDefault()
            onEmptyBackspace()
          }
        }}
        placeholder="Write anything"
        className={cn(
          "min-w-0 flex-1 bg-transparent py-0.5 text-[15px] tracking-[-0.2px] outline-none",
          item.done && "text-muted-foreground line-through"
        )}
      />
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete subtask"
        className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}

const fieldClass =
  "h-8 w-full rounded-md bg-transparent px-0 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/55"

function ChoiceChip({
  pressed,
  onClick,
  children,
  idleClass,
  activeClass,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  idleClass?: string
  activeClass?: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[12px] tracking-[-0.1px] transition-all duration-200 active:scale-95",
        pressed
          ? (activeClass ?? "bg-foreground text-background")
          : (idleClass ??
              "bg-black/[0.04] text-muted-foreground hover:bg-black/[0.07] hover:text-foreground dark:bg-white/[0.06] dark:hover:bg-white/[0.1]")
      )}
    >
      {children}
    </button>
  )
}

function Property({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] tracking-[0.04em] text-muted-foreground uppercase">
        {icon}
        {label}
      </p>
      {children}
    </div>
  )
}

function formatCreated(timestamp: number) {
  if (!timestamp) return "just now"
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTaskTime(ms: number) {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const clock = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  return hours > 0 ? `${String(hours).padStart(2, "0")}:${clock}` : clock
}
