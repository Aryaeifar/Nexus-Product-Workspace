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
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState, type ReactNode } from "react"

import { Modal } from "@/components/ui/modal"
import { appleDuration, appleEase } from "@/lib/motion"
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
  const reduced = useReducedMotion()
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
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: appleDuration.ui, ease: appleEase }}
      >
        <input
          value={task.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Task title"
          className="w-full bg-transparent text-[30px] leading-[1.15] font-semibold tracking-[-0.6px] text-foreground outline-none placeholder:text-muted-foreground/45"
        />
        <textarea
          value={task.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Add a description…"
          rows={3}
          className="mt-3 w-full resize-none rounded-xl bg-transparent text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground/55 transition-colors focus:bg-black/[0.02] dark:focus:bg-white/[0.03]"
        />
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: appleDuration.ui,
          delay: reduced ? 0 : 0.06,
          ease: appleEase,
        }}
        className="mt-6 rounded-2xl bg-black/[0.03] p-2 dark:bg-white/[0.04]"
      >
        <PropertyRow icon={<CircleDot className="size-3.5" />} label="Status">
          <div
            role="radiogroup"
            aria-label="Status"
            className="flex flex-wrap gap-1"
          >
            {TASK_STATUSES.map((status) => (
              <ChoiceChip
                key={status.id}
                pressed={task.status === status.id}
                onClick={() =>
                  onChange({
                    status: status.id,
                    done: status.id === "done",
                  })
                }
              >
                {status.label}
              </ChoiceChip>
            ))}
          </div>
        </PropertyRow>

        <PropertyRow icon={<Flag className="size-3.5" />} label="Priority">
          <div
            role="radiogroup"
            aria-label="Priority"
            className="flex flex-wrap gap-1"
          >
            {TASK_PRIORITIES.map((priority) => (
              <ChoiceChip
                key={priority.id}
                pressed={task.priority === priority.id}
                onClick={() => onChange({ priority: priority.id })}
              >
                <span className={cn("size-1.5 rounded-full", priority.swatch)} />
                {priority.label}
              </ChoiceChip>
            ))}
          </div>
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
            <p className="px-2 font-mono text-[14px] tabular-nums text-foreground">
              {formatTaskTime(elapsedMs)}
            </p>
            <button
              type="button"
              onClick={onResetTime}
              disabled={elapsedMs <= 0}
              aria-label="Reset time"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] text-muted-foreground transition-all duration-200 hover:bg-black/5 hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/8"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          </div>
        </PropertyRow>

        <PropertyRow icon={<Tag className="size-3.5" />} label="Labels">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence initial={false}>
                {task.labels.map((label) => (
                  <motion.button
                    key={label}
                    type="button"
                    layout
                    initial={reduced ? false : { opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.86 }}
                    transition={{ duration: 0.2, ease: appleEase }}
                    onClick={() =>
                      onChange({
                        labels: task.labels.filter((item) => item !== label),
                      })
                    }
                    className="rounded-full bg-foreground/8 px-2.5 py-1 text-[12px] text-foreground transition-colors hover:bg-foreground/12"
                  >
                    {label}
                  </motion.button>
                ))}
              </AnimatePresence>
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
                className="min-w-[88px] flex-1 bg-transparent px-2 py-1 text-[14px] outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {TASK_LABELS.filter((label) => !task.labels.includes(label)).map(
                (label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => addLabel(label)}
                    className="rounded-full px-2.5 py-1 text-[12px] text-muted-foreground transition-all duration-200 hover:bg-black/5 hover:text-foreground active:scale-95 dark:hover:bg-white/8"
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </PropertyRow>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: appleDuration.ui,
          delay: reduced ? 0 : 0.12,
          ease: appleEase,
        }}
        className="mt-6"
      >
        <div className="flex items-center justify-between px-1">
          <p className="text-[13px] text-muted-foreground">Checklist</p>
          {task.subtasks.length > 0 ? (
            <p className="text-[12px] text-muted-foreground">
              {doneCount}/{task.subtasks.length}
            </p>
          ) : null}
        </div>
        <div className="mt-2 space-y-1">
          <AnimatePresence initial={false}>
            {task.subtasks.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: appleEase }}
                className="flex items-center gap-2 rounded-xl px-1.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
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
                    item.done
                      ? "Mark subtask incomplete"
                      : "Mark subtask complete"
                  }
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-foreground transition-colors",
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
                    "min-w-0 flex-1 bg-transparent py-2 text-[14px] outline-none transition-colors",
                    item.done && "text-muted-foreground line-through"
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center gap-2 rounded-xl px-1.5">
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
              className="min-w-0 flex-1 bg-transparent py-2 text-[14px] outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </motion.div>

      <p className="mt-7 px-1 text-[12px] text-muted-foreground">
        Created {formatCreated(task.createdAt)}
      </p>
    </Modal>
  )
}

const fieldClass =
  "h-9 w-full rounded-xl bg-transparent px-2 text-[14px] text-foreground outline-none transition-colors hover:bg-black/[0.03] focus:bg-black/[0.04] dark:hover:bg-white/[0.05] dark:focus:bg-white/[0.06]"

function ChoiceChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] transition-all duration-200 active:scale-95",
        pressed
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8"
      )}
    >
      {children}
    </button>
  )
}

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
    <div className="flex items-start gap-4 rounded-xl px-2 py-2">
      <p className="mt-1.5 flex w-24 shrink-0 items-center gap-2 text-[13px] text-muted-foreground">
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
