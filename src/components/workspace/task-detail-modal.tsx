"use client"

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
} from "lucide-react"
import { useState, type ReactNode } from "react"

import { Modal } from "@/components/ui/modal"
import { cn } from "@/lib/utils"

export const TASK_STATUSES = [
  { id: "todo", label: "Todo" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "canceled", label: "Canceled" },
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
  onOpenChange,
  onChange,
  onResetTime,
}: {
  open: boolean
  task: TaskDetails
  elapsedMs: number
  onOpenChange: (open: boolean) => void
  onChange: (patch: Partial<TaskDetails>) => void
  onResetTime: () => void
}) {
  const [labelDraft, setLabelDraft] = useState("")
  const [subtaskDraft, setSubtaskDraft] = useState("")
  const heading = task.title.trim() || "Untitled"
  const doneCount = task.subtasks.filter((item) => item.done).length

  function addLabel(label: string) {
    const next = label.trim()
    if (!next || task.labels.includes(next)) return
    onChange({ labels: [...task.labels, next] })
    setLabelDraft("")
  }

  function addSubtask() {
    const title = subtaskDraft.trim()
    if (!title) return
    onChange({ subtasks: [...task.subtasks, createSubtask(title)] })
    setSubtaskDraft("")
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={heading}
      description="Task details"
    >
      <input
        value={task.title}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="Task title"
        className="w-full bg-transparent text-[28px] leading-[1.2] font-semibold tracking-[-0.5px] text-foreground outline-none placeholder:text-muted-foreground/50"
      />
      <textarea
        value={task.description}
        onChange={(event) => onChange({ description: event.target.value })}
        placeholder="Add a description…"
        rows={3}
        className="mt-3 w-full resize-none bg-transparent text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground/60"
      />

      <div className="mt-6 space-y-0.5">
        <PropertyRow icon={<CircleDot className="size-3.5" />} label="Status">
          <select
            aria-label="Status"
            value={task.status}
            onChange={(event) => {
              const status = event.target.value as TaskStatus
              onChange({ status, done: status === "done" })
            }}
            className={fieldClass}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </PropertyRow>

        <PropertyRow icon={<Flag className="size-3.5" />} label="Priority">
          <select
            aria-label="Priority"
            value={task.priority}
            onChange={(event) =>
              onChange({ priority: event.target.value as TaskPriority })
            }
            className={fieldClass}
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.label}
              </option>
            ))}
          </select>
        </PropertyRow>

        <PropertyRow icon={<UserRound className="size-3.5" />} label="Assignee">
          <input
            value={task.assignee}
            onChange={(event) => onChange({ assignee: event.target.value })}
            placeholder="Unassigned"
            aria-label="Assignee"
            className={fieldClass}
          />
        </PropertyRow>

        <PropertyRow icon={<Calendar className="size-3.5" />} label="Due date">
          <input
            type="date"
            value={task.dueDate}
            onChange={(event) => onChange({ dueDate: event.target.value })}
            aria-label="Due date"
            className={fieldClass}
          />
        </PropertyRow>

        <PropertyRow icon={<Timer className="size-3.5" />} label="Estimate">
          <input
            type="number"
            min={0}
            step={0.5}
            value={task.estimate ?? ""}
            onChange={(event) =>
              onChange({
                estimate:
                  event.target.value === "" ? null : Number(event.target.value),
              })
            }
            placeholder="0h"
            aria-label="Estimate"
            className={fieldClass}
          />
        </PropertyRow>

        <PropertyRow icon={<Clock3 className="size-3.5" />} label="Tracked">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <p className="px-1.5 font-mono text-[14px] tabular-nums text-foreground">
              {formatTaskTime(elapsedMs)}
            </p>
            <button
              type="button"
              onClick={onResetTime}
              disabled={elapsedMs <= 0}
              aria-label="Reset time"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-muted-foreground hover:bg-black/4 hover:text-foreground disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/6"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          </div>
        </PropertyRow>

        <PropertyRow icon={<Tag className="size-3.5" />} label="Labels">
          <div className="min-w-0 flex-1">
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
                  className="rounded-full bg-black/5 px-2 py-0.5 text-[12px] text-foreground hover:bg-black/8 dark:bg-white/8 dark:hover:bg-white/12"
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
                className="min-w-[88px] flex-1 bg-transparent px-1.5 py-1 text-[14px] outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {TASK_LABELS.filter((label) => !task.labels.includes(label)).map(
                (label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => addLabel(label)}
                    className="rounded-full px-2 py-0.5 text-[12px] text-muted-foreground hover:bg-black/4 hover:text-foreground dark:hover:bg-white/6"
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </PropertyRow>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-muted-foreground">Checklist</p>
          {task.subtasks.length > 0 ? (
            <p className="text-[12px] text-muted-foreground">
              {doneCount}/{task.subtasks.length}
            </p>
          ) : null}
        </div>
        <div className="mt-2 space-y-1">
          {task.subtasks.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === item.id
                        ? { ...subtask, done: !subtask.done }
                        : subtask
                    ),
                  })
                }
                aria-label={
                  item.done ? "Mark subtask incomplete" : "Mark subtask complete"
                }
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-foreground",
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
                value={item.title}
                onChange={(event) =>
                  onChange({
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === item.id
                        ? { ...subtask, title: event.target.value }
                        : subtask
                    ),
                  })
                }
                className={cn(
                  "min-w-0 flex-1 bg-transparent py-1 text-[14px] outline-none",
                  item.done && "text-muted-foreground line-through"
                )}
              />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Plus className="size-3.5 text-muted-foreground" />
            <input
              value={subtaskDraft}
              onChange={(event) => setSubtaskDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addSubtask()
                }
              }}
              placeholder="Add a subtask"
              aria-label="Add a subtask"
              className="min-w-0 flex-1 bg-transparent py-1 text-[14px] outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>

      <p className="mt-8 text-[12px] text-muted-foreground">
        Created {formatCreated(task.createdAt)}
      </p>
    </Modal>
  )
}

const fieldClass =
  "h-8 w-full rounded-md bg-transparent px-1.5 text-[14px] text-foreground outline-none hover:bg-black/4 dark:hover:bg-white/6"

function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4 py-1">
      <p className="mt-1.5 flex w-28 shrink-0 items-center gap-2 text-[13px] text-muted-foreground">
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
