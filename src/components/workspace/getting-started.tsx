"use client"

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react"
import {
  CheckSquare,
  Copy,
  GripVertical,
  PaintBucket,
  Palette,
  Pause,
  Play,
  PlayCircle,
  Plus,
  Square,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react"

import { AnimatedListItem } from "@/components/ui/animated-list"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { EmptyState } from "@/components/ui/empty-state"
import { Highlighter } from "@/components/ui/highlighter"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { cn } from "@/lib/utils"

const TASK_COLORS = [
  {
    id: "gray",
    label: "Gray",
    swatch: "bg-zinc-400",
    textClass: "text-zinc-500",
    backgroundClass: "bg-zinc-100 dark:bg-zinc-800",
  },
  {
    id: "red",
    label: "Red",
    swatch: "bg-red-500",
    textClass: "text-red-600 dark:text-red-400",
    backgroundClass: "bg-red-100 dark:bg-red-950/50",
  },
  {
    id: "orange",
    label: "Orange",
    swatch: "bg-orange-500",
    textClass: "text-orange-600 dark:text-orange-400",
    backgroundClass: "bg-orange-100 dark:bg-orange-950/40",
  },
  {
    id: "green",
    label: "Green",
    swatch: "bg-green-500",
    textClass: "text-green-600 dark:text-green-400",
    backgroundClass: "bg-green-100 dark:bg-green-950/40",
  },
  {
    id: "blue",
    label: "Blue",
    swatch: "bg-blue-500",
    textClass: "text-blue-600 dark:text-blue-400",
    backgroundClass: "bg-blue-100 dark:bg-blue-950/40",
  },
  {
    id: "purple",
    label: "Purple",
    swatch: "bg-purple-500",
    textClass: "text-purple-600 dark:text-purple-400",
    backgroundClass: "bg-purple-100 dark:bg-purple-950/40",
  },
] as const

type TaskColorId = (typeof TASK_COLORS)[number]["id"]

type Todo = {
  id: string
  title: string
  done: boolean
  color?: TaskColorId
  background?: TaskColorId
}

function isTaskColor(value: unknown): value is TaskColorId {
  return TASK_COLORS.some((color) => color.id === value)
}

function taskColor(id?: string) {
  return TASK_COLORS.find((color) => color.id === id)
}

function normalizeTodo(value: unknown): Todo | null {
  if (!value || typeof value !== "object") return null
  const todo = value as Record<string, unknown>
  if (typeof todo.id !== "string" || typeof todo.title !== "string") return null
  return {
    id: todo.id,
    title: todo.title,
    done: todo.done === true,
    color: isTaskColor(todo.color) ? todo.color : undefined,
    background: isTaskColor(todo.background) ? todo.background : undefined,
  }
}

const STORAGE_KEY = "nexus.home.todos.v2"

const EXAMPLES = [
  "Write a note for standup",
  "Review the onboarding flow",
  "Invite the rest of the team",
  "Ship the Q3 launch checklist",
]

function createTodo(title = ""): Todo {
  return { id: crypto.randomUUID(), title, done: false }
}

type TaskTimer = {
  taskId: string
  title: string
  running: boolean
  elapsedMs: number
  startedAt: number | null
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const clock = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  return hours > 0 ? `${String(hours).padStart(2, "0")}:${clock}` : clock
}

function currentElapsed(timer: TaskTimer, now: number) {
  if (!timer.running || timer.startedAt == null) return timer.elapsedMs
  return timer.elapsedMs + (now - timer.startedAt)
}

type TimerCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const TIMER_INSET = 24

const TIMER_SNAP = {
  type: "spring" as const,
  stiffness: 210,
  damping: 24,
  mass: 0.85,
}

function timerCornerPosition(
  corner: TimerCorner,
  width: number,
  height: number
) {
  const vw = typeof window === "undefined" ? 1200 : window.innerWidth
  const vh = typeof window === "undefined" ? 800 : window.innerHeight
  const left = TIMER_INSET
  const top = TIMER_INSET
  const right = Math.max(TIMER_INSET, vw - width - TIMER_INSET)
  const bottom = Math.max(TIMER_INSET, vh - height - TIMER_INSET)

  if (corner === "top-left") return { x: left, y: top }
  if (corner === "top-right") return { x: right, y: top }
  if (corner === "bottom-left") return { x: left, y: bottom }
  return { x: right, y: bottom }
}

function nearestTimerCorner(x: number, y: number, width: number, height: number) {
  const centerX = x + width / 2
  const centerY = y + height / 2
  const left = centerX < window.innerWidth / 2
  const top = centerY < window.innerHeight / 2
  if (top && left) return "top-left"
  if (top) return "top-right"
  if (left) return "bottom-left"
  return "bottom-right"
}

export function GettingStarted() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [ready, setReady] = useState(false)
  const [timer, setTimer] = useState<TaskTimer | null>(null)
  const [timerCorner, setTimerCorner] = useState<TimerCorner>("bottom-right")
  const focusId = useRef<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          setTodos(
            parsed.flatMap((item) => {
              const todo = normalizeTodo(item)
              return todo ? [todo] : []
            })
          )
        }
      }
    } catch {
      /* empty */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [ready, todos])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function update(id: string, patch: Partial<Todo>) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, ...patch } : todo))
    )
    if (typeof patch.title === "string") {
      const title = patch.title
      setTimer((current) =>
        current?.taskId === id ? { ...current, title } : current
      )
    }
  }

  function remove(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
    setTimer((current) => (current?.taskId === id ? null : current))
  }

  function startTimer(todo: Todo) {
    const now = Date.now()
    setTimer((current) => {
      if (current?.taskId === todo.id) {
        if (current.running) return current
        return {
          ...current,
          title: todo.title,
          running: true,
          startedAt: now,
        }
      }
      return {
        taskId: todo.id,
        title: todo.title || "Untitled task",
        running: true,
        elapsedMs: 0,
        startedAt: now,
      }
    })
  }

  function pauseTimer() {
    const now = Date.now()
    setTimer((current) => {
      if (!current?.running) return current
      return {
        ...current,
        running: false,
        elapsedMs: currentElapsed(current, now),
        startedAt: null,
      }
    })
  }

  function stopTimer() {
    setTimer(null)
  }

  function duplicate(id: string) {
    setTodos((current) => {
      const index = current.findIndex((todo) => todo.id === id)
      const source = current[index]
      if (!source) return current
      const copy = [...current]
      copy.splice(index + 1, 0, { ...source, id: crypto.randomUUID() })
      return copy
    })
  }

  function addAfter(id?: string) {
    const next = createTodo()
    focusId.current = next.id
    setTodos((current) => {
      if (!id) return [...current, next]
      const index = current.findIndex((todo) => todo.id === id)
      const copy = [...current]
      copy.splice(index + 1, 0, next)
      return copy
    })
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setTodos((current) => {
      const from = current.findIndex((todo) => todo.id === active.id)
      const to = current.findIndex((todo) => todo.id === over.id)
      return arrayMove(current, from, to)
    })
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-8 py-16 sm:px-16">
      <p className="text-[40px] leading-none">📝</p>
      <h1 className="text-display-lg mt-4 text-foreground">
        <Highlighter action="highlight" color="#cce4ff">
          Getting started
        </Highlighter>
      </h1>
      <p className="text-body mt-3 text-muted-foreground">
        Your private runway in Nexus. Capture the next move, check it off, and
        keep the list in the order the work{" "}
        <Highlighter action="underline" color="#2997ff">
          actually happens
        </Highlighter>
        .
      </p>

      <div className="mt-10 min-h-[2.5rem]">
        <TypingAnimation
          words={EXAMPLES}
          loop
          startOnView={false}
          typeSpeed={48}
          deleteSpeed={28}
          pauseDelay={1400}
          className="text-[16px] leading-normal font-normal tracking-[-0.3px] text-muted-foreground"
          cursorStyle="line"
        />
      </div>

      {todos.length === 0 ? (
        <EmptyState
          className="mt-6 rounded-[18px] border border-dashed border-foreground/15"
          icon={<CheckSquare />}
          title="Nothing here yet"
          highlight="Nothing here"
          description="Add a to-do. New items animate in. Drag the handle to reorder, or right-click it to duplicate, delete, or change its color."
          action={
            <button
              type="button"
              onClick={() => addAfter()}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-[22px] py-[11px] text-[15px] text-background"
            >
              <Plus className="size-4" />
              Add a to-do
            </button>
          }
        />
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={todos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mt-4 flex flex-col gap-1">
                <AnimatePresence initial={false} mode="popLayout">
                  {todos.map((todo) => (
                    <AnimatedListItem key={todo.id}>
                      <SortableTodo
                        todo={todo}
                        autoFocus={focusId.current === todo.id}
                        onFocused={() => {
                          if (focusId.current === todo.id)
                            focusId.current = null
                        }}
                        onChange={(title) => update(todo.id, { title })}
                        onToggle={() => update(todo.id, { done: !todo.done })}
                        onDelete={() => remove(todo.id)}
                        onDuplicate={() => duplicate(todo.id)}
                        onColor={(color) => update(todo.id, { color })}
                        onBackground={(background) =>
                          update(todo.id, { background })
                        }
                        onEnter={() => addAfter(todo.id)}
                        onEmptyBackspace={() => remove(todo.id)}
                        timerActive={timer?.taskId === todo.id}
                        timerRunning={
                          timer?.taskId === todo.id && timer.running
                        }
                        onStartTimer={() => startTimer(todo)}
                        onPauseTimer={pauseTimer}
                        onStopTimer={stopTimer}
                      />
                    </AnimatedListItem>
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            onClick={() => addAfter()}
            className="mt-2 flex h-8 w-full items-center gap-2 rounded-md px-1 text-[15px] text-muted-foreground hover:bg-black/4 dark:hover:bg-white/6"
          >
            <Plus className="size-4" />
            Add a to-do
          </button>
        </>
      )}

      {timer ? (
        <TaskTimerCard
          timer={timer}
          corner={timerCorner}
          onCornerChange={setTimerCorner}
          onStart={() => {
            const todo = todos.find((item) => item.id === timer.taskId)
            if (todo) startTimer(todo)
          }}
          onPause={pauseTimer}
          onStop={stopTimer}
        />
      ) : null}
    </div>
  )
}

function TaskTimerCard({
  timer,
  corner,
  onCornerChange,
  onStart,
  onPause,
  onStop,
}: {
  timer: TaskTimer
  corner: TimerCorner
  onCornerChange: (corner: TimerCorner) => void
  onStart: () => void
  onPause: () => void
  onStop: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragSize = useRef({ width: 240, height: 108 })
  const dragging = useRef(false)
  const snapX = useRef<ReturnType<typeof animate> | null>(null)
  const snapY = useRef<ReturnType<typeof animate> | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [draggingCard, setDraggingCard] = useState(false)
  const x = useMotionValue(TIMER_INSET)
  const y = useMotionValue(TIMER_INSET)

  function stopSnap() {
    snapX.current?.stop()
    snapY.current?.stop()
    snapX.current = null
    snapY.current = null
  }

  function placeAtCorner(next: TimerCorner, width: number, height: number) {
    const target = timerCornerPosition(next, width, height)
    stopSnap()
    snapX.current = animate(x, target.x, TIMER_SNAP)
    snapY.current = animate(y, target.y, TIMER_SNAP)
  }

  useLayoutEffect(() => {
    const width = cardRef.current?.offsetWidth ?? 240
    const height = cardRef.current?.offsetHeight ?? 108
    const target = timerCornerPosition(corner, width, height)
    x.set(target.x)
    y.set(target.y)
    // Only pin the initial mount; later drops are animated in onPointerUp.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onResize() {
      if (dragging.current) return
      const width = cardRef.current?.offsetWidth ?? 240
      const height = cardRef.current?.offsetHeight ?? 108
      const target = timerCornerPosition(corner, width, height)
      x.set(target.x)
      y.set(target.y)
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [corner, x, y])

  useEffect(() => {
    setNow(Date.now())
    if (!timer.running) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [timer.running, timer.startedAt])

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    if ((event.target as HTMLElement).closest("button")) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    dragging.current = true
    setDraggingCard(true)
    stopSnap()
    dragSize.current = { width: rect.width, height: rect.height }
    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    x.set(rect.left)
    y.set(rect.top)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    x.set(event.clientX - dragOffset.current.x)
    y.set(event.clientY - dragOffset.current.y)
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    dragging.current = false
    setDraggingCard(false)
    const width = dragSize.current.width
    const height = dragSize.current.height
    const next = nearestTimerCorner(
      event.clientX - dragOffset.current.x,
      event.clientY - dragOffset.current.y,
      width,
      height
    )
    onCornerChange(next)
    placeAtCorner(next, width, height)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const controlClass =
    "inline-flex size-7 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-white/50 hover:text-foreground dark:hover:bg-white/10"

  return (
    <motion.div
      ref={cardRef}
      data-corner={corner}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ top: y, left: x }}
      className={cn(
        "pointer-events-auto fixed z-50 w-[240px] cursor-grab overflow-hidden rounded-[22px] bg-white/50 p-3 shadow-[0_8px_32px_rgb(0_0_0/0.1),inset_0_1px_0_rgb(255_255_255/0.55)] backdrop-blur-2xl backdrop-saturate-150 select-none dark:bg-white/8 dark:shadow-[0_12px_40px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.12)]",
        draggingCard && "cursor-grabbing"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.45),transparent_42%)] dark:bg-[linear-gradient(180deg,rgb(255_255_255/0.08),transparent_50%)]"
      />
      <div className="relative">
        <p className="truncate text-[13px] text-foreground/70">
          {timer.title || "Untitled task"}
        </p>
        <p className="mt-1 font-mono text-[22px] leading-none tracking-tight tabular-nums text-foreground">
          {formatElapsed(currentElapsed(timer, now))}
        </p>
        <div className="mt-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={timer.running ? onPause : onStart}
            aria-label={timer.running ? "Pause timer" : "Play timer"}
            className={controlClass}
          >
            {timer.running ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onStart}
            aria-label="Start timer"
            className={controlClass}
          >
            <PlayCircle className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop timer"
            className={controlClass}
          >
            <Square className="size-3 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ColorMenu({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string
  icon: LucideIcon
  value?: TaskColorId
  onChange: (color: TaskColorId | undefined) => void
}) {
  const current = taskColor(value)

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>
        <Icon />
        {label}
        {current ? (
          <span className={cn("size-2.5 rounded-full", current.swatch)} />
        ) : null}
      </ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuRadioGroup
          value={value ?? "default"}
          onValueChange={(next) =>
            onChange(isTaskColor(next) ? next : undefined)
          }
        >
          <ContextMenuRadioItem value="default" closeOnClick>
            <span className="size-3 rounded-full border border-foreground/30 bg-background" />
            Default
          </ContextMenuRadioItem>
          {TASK_COLORS.map((color) => (
            <ContextMenuRadioItem key={color.id} value={color.id} closeOnClick>
              <span className={cn("size-3 rounded-full", color.swatch)} />
              {color.label}
            </ContextMenuRadioItem>
          ))}
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  )
}

function SortableTodo({
  todo,
  autoFocus,
  onFocused,
  onChange,
  onToggle,
  onDelete,
  onDuplicate,
  onColor,
  onBackground,
  onEnter,
  onEmptyBackspace,
  timerActive,
  timerRunning,
  onStartTimer,
  onPauseTimer,
  onStopTimer,
}: {
  todo: Todo
  autoFocus: boolean
  onFocused: () => void
  onChange: (title: string) => void
  onToggle: () => void
  onDelete: () => void
  onDuplicate: () => void
  onColor: (color: TaskColorId | undefined) => void
  onBackground: (color: TaskColorId | undefined) => void
  onEnter: () => void
  onEmptyBackspace: () => void
  timerActive: boolean
  timerRunning: boolean
  onStartTimer: () => void
  onPauseTimer: () => void
  onStopTimer: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })
  const text = taskColor(todo.color)
  const background = taskColor(todo.background)

  useEffect(() => {
    if (!autoFocus) return
    inputRef.current?.focus()
    onFocused()
  }, [autoFocus, onFocused])

  return (
    <div
      ref={setNodeRef}
      data-color={todo.color}
      data-background={todo.background}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-start gap-2 rounded-md px-1 py-0.5",
        isDragging && "z-10 shadow-md",
        background?.backgroundClass ??
          (isDragging ? "bg-background" : undefined)
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger
          render={<button type="button" />}
          className={cn(
            "mt-1.5 cursor-grab rounded p-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 active:cursor-grabbing data-popup-open:opacity-100",
            text?.textClass ?? "text-muted-foreground"
          )}
          aria-label="Drag to reorder"
          title="Drag to reorder, or right-click for actions"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52" side="bottom" align="start">
          <ContextMenuItem onClick={onDuplicate}>
            <Copy />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 />
            Delete
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ColorMenu
            label="Color"
            icon={Palette}
            value={todo.color}
            onChange={onColor}
          />
          <ColorMenu
            label="Background"
            icon={PaintBucket}
            value={todo.background}
            onChange={onBackground}
          />
        </ContextMenuContent>
      </ContextMenu>
      <button
        type="button"
        onClick={onToggle}
        aria-label={todo.done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "mt-1.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-foreground bg-background text-background",
          todo.done && "bg-foreground text-background"
        )}
      >
        {todo.done ? (
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
        value={todo.title}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            onEnter()
          }
          if (event.key === "Backspace" && todo.title === "") {
            event.preventDefault()
            onEmptyBackspace()
          }
        }}
        placeholder="Write anything"
        className={cn(
          "min-w-0 flex-1 bg-transparent py-1 text-[16px] outline-none",
          todo.done && "line-through",
          text
            ? [text.textClass, "placeholder:text-current"]
            : [
                "placeholder:text-muted-foreground",
                todo.done && "text-muted-foreground",
              ]
        )}
      />
      <button
        type="button"
        onClick={timerRunning ? onPauseTimer : onStartTimer}
        aria-label={timerRunning ? "Pause timer" : "Play timer"}
        className={cn(
          "mt-1 rounded p-1 text-muted-foreground opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 hover:text-foreground",
          timerActive && "opacity-100 text-foreground"
        )}
      >
        {timerRunning ? (
          <Pause className="size-3.5" />
        ) : (
          <Play className="size-3.5" />
        )}
      </button>
      <button
        type="button"
        onClick={onStopTimer}
        aria-label="Stop timer"
        disabled={!timerActive}
        className={cn(
          "mt-1 rounded p-1 text-muted-foreground opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 hover:text-foreground disabled:pointer-events-none",
          timerActive && "opacity-100"
        )}
      >
        <Square className="size-3.5 fill-current" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete"
        className="mt-1 rounded p-1 text-muted-foreground opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
