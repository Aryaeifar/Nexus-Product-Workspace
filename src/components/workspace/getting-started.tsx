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
import { AnimatePresence } from "motion/react"
import { CheckSquare, GripVertical, Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { EmptyState } from "@/components/ui/empty-state"
import { AnimatedListItem } from "@/components/ui/animated-list"
import { Highlighter } from "@/components/ui/highlighter"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { cn } from "@/lib/utils"

type Todo = {
  id: string
  title: string
  done: boolean
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

export function GettingStarted() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [ready, setReady] = useState(false)
  const focusId = useRef<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Todo[]
        if (Array.isArray(parsed)) setTodos(parsed)
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
  }

  function remove(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
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
          className="text-muted-foreground text-[16px] font-normal tracking-[-0.3px] leading-normal"
          cursorStyle="line"
        />
      </div>

      {todos.length === 0 ? (
        <EmptyState
          className="mt-6 rounded-[18px] border border-dashed border-foreground/15"
          icon={<CheckSquare />}
          title="Nothing here yet"
          highlight="Nothing here"
          description="Add a to-do. New items animate in. Drag the handle to reorder, or clear a line to remove it."
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
                          if (focusId.current === todo.id) focusId.current = null
                        }}
                        onChange={(title) => update(todo.id, { title })}
                        onToggle={() => update(todo.id, { done: !todo.done })}
                        onDelete={() => remove(todo.id)}
                        onEnter={() => addAfter(todo.id)}
                        onEmptyBackspace={() => remove(todo.id)}
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
            className="text-muted-foreground mt-2 flex h-8 w-full items-center gap-2 rounded-md px-1 text-[15px] hover:bg-black/4 dark:hover:bg-white/6"
          >
            <Plus className="size-4" />
            Add a to-do
          </button>
        </>
      )}
    </div>
  )
}

function SortableTodo({
  todo,
  autoFocus,
  onFocused,
  onChange,
  onToggle,
  onDelete,
  onEnter,
  onEmptyBackspace,
}: {
  todo: Todo
  autoFocus: boolean
  onFocused: () => void
  onChange: (title: string) => void
  onToggle: () => void
  onDelete: () => void
  onEnter: () => void
  onEmptyBackspace: () => void
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

  useEffect(() => {
    if (!autoFocus) return
    inputRef.current?.focus()
    onFocused()
  }, [autoFocus, onFocused])

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-start gap-2 rounded-md px-1 py-0.5",
        isDragging && "z-10 bg-background"
      )}
    >
      <button
        type="button"
        className="text-muted-foreground mt-1.5 cursor-grab rounded opacity-0 group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
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
          todo.done && "text-muted-foreground line-through"
        )}
      />
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete"
        className="text-muted-foreground mt-1 rounded p-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
