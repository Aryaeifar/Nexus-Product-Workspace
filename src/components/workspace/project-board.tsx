"use client"

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useId, useMemo, useRef, useState } from "react"

import { EmptyState } from "@/components/ui/empty-state"
import { Highlighter } from "@/components/ui/highlighter"
import { Spinner } from "@/components/ui/spinner"
import { appleDuration, appleEase } from "@/lib/motion"
import {
  addCard,
  addColumn,
  cardsInColumn,
  emptyBoard,
  moveCard,
  parseBoard,
  parseBoardsRecord,
  PROJECT_BOARDS_STORAGE_KEY,
  removeCard,
  removeColumn,
  renameCard,
  renameColumn,
  type BoardCard,
  type ProjectBoard,
} from "@/lib/project-board"
import { cn } from "@/lib/utils"

function cardDndId(id: string) {
  return `card:${id}`
}

function columnDndId(id: string) {
  return `column:${id}`
}

function parseDndId(id: string) {
  if (id.startsWith("card:")) return { type: "card" as const, id: id.slice(5) }
  if (id.startsWith("column:")) {
    return { type: "column" as const, id: id.slice(7) }
  }
  return null
}

function applyBoard(
  setter: (board: ProjectBoard) => void,
  result: { board: ProjectBoard } | { error: string },
  onError: (message: string) => void
) {
  if ("error" in result) {
    onError(result.error)
    return false
  }
  setter(result.board)
  onError("")
  return true
}

export function ProjectBoard({
  projectId,
  projectName,
  projectSlug,
}: {
  projectId: string
  projectName: string
  projectSlug: string
}) {
  const [board, setBoard] = useState<ProjectBoard>(emptyBoard)
  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [notice, setNotice] = useState("")
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const boardRef = useRef(board)
  boardRef.current = board
  const reduced = useReducedMotion()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    const raw = localStorage.getItem(PROJECT_BOARDS_STORAGE_KEY)
    if (!raw) {
      setBoard(emptyBoard())
      setLoadError(false)
      setReady(true)
      return
    }

    try {
      const parsed = JSON.parse(raw) as unknown
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        projectId in parsed
      ) {
        const stored = parseBoard((parsed as Record<string, unknown>)[projectId])
        if (!stored) {
          setLoadError(true)
          setReady(true)
          return
        }
        setBoard(stored)
      } else {
        setBoard(emptyBoard())
      }
      setLoadError(false)
    } catch {
      setLoadError(true)
    }
    setReady(true)
  }, [projectId])

  useEffect(() => {
    if (!ready) return
    const record = parseBoardsRecord(
      localStorage.getItem(PROJECT_BOARDS_STORAGE_KEY)
    )
    record[projectId] = board
    localStorage.setItem(PROJECT_BOARDS_STORAGE_KEY, JSON.stringify(record))
  }, [board, projectId, ready])

  const activeCard = board.cards.find((card) => card.id === activeCardId)

  function columnIdFromOver(overId: string, current: ProjectBoard) {
    const parsed = parseDndId(overId)
    if (!parsed) return null
    if (parsed.type === "column") return parsed.id
    return current.cards.find((card) => card.id === parsed.id)?.columnId ?? null
  }

  function indexInColumn(
    current: ProjectBoard,
    columnId: string,
    overId: string,
    activeId: string
  ) {
    const items = cardsInColumn(current, columnId).map((card) => card.id)
    const parsed = parseDndId(overId)
    if (!parsed || parsed.type === "column") return items.length
    const overIndex = items.indexOf(parsed.id)
    const activeIndex = items.indexOf(activeId)
    if (overIndex < 0) return items.length
    if (activeIndex >= 0 && activeIndex < overIndex) return overIndex
    return overIndex
  }

  function onDragStart(event: DragStartEvent) {
    const parsed = parseDndId(String(event.active.id))
    if (parsed?.type === "card") setActiveCardId(parsed.id)
  }

  function relocate(activeId: string, overId: string) {
    const currentBoard = boardRef.current
    const parsed = parseDndId(activeId)
    if (parsed?.type !== "card") return
    const toColumnId = columnIdFromOver(overId, currentBoard)
    if (!toColumnId) return
    const nextIndex = indexInColumn(currentBoard, toColumnId, overId, parsed.id)
    const current = currentBoard.cards.find((card) => card.id === parsed.id)
    if (!current) return
    const currentIndex = cardsInColumn(currentBoard, current.columnId).findIndex(
      (card) => card.id === parsed.id
    )
    if (current.columnId === toColumnId && currentIndex === nextIndex) return
    setBoard(moveCard(currentBoard, parsed.id, toColumnId, nextIndex))
  }

  function onDragOver(event: DragOverEvent) {
    if (!event.over) return
    relocate(String(event.active.id), String(event.over.id))
  }

  function onDragEnd(event: DragEndEvent) {
    if (event.over) relocate(String(event.active.id), String(event.over.id))
    setActiveCardId(null)
  }

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (loadError) {
    return (
      <EmptyState
        title="Board could not be read"
        highlight="could not be read"
        description="The saved columns for this project are damaged. Reset to start again with the four starter columns."
        action={
          <button
            type="button"
            onClick={() => {
              setBoard(emptyBoard())
              setLoadError(false)
            }}
            className="inline-flex h-11 items-center justify-center rounded-full bg-apple-primary px-5 text-[14px] text-white transition-colors hover:bg-apple-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-primary-focus"
          >
            Reset board
          </button>
        }
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <motion.header
        className="shrink-0 border-b border-black/6 px-4 pt-5 pb-4 sm:px-6 dark:border-white/8"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: appleDuration.ui, ease: appleEase }}
      >
        <p className="mb-3 text-[12px] text-[#4a4a4a] dark:text-[#a1a1a6]">
          /projekts/{projectSlug}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-[clamp(24px,4.2vw,34px)] font-semibold tracking-[-0.6px] text-foreground">
              <Highlighter action="highlight" color="#cce4ff" isView>
                {projectName}
              </Highlighter>
            </h1>
            <motion.span
              aria-hidden
              className="mt-2 block h-0.5 w-14 origin-left rounded-full bg-apple-primary"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: appleDuration.ui,
                delay: reduced ? 0 : 0.12,
                ease: appleEase,
              }}
            />
          </div>
          <p className="pb-1 text-[13px] text-[#4a4a4a] dark:text-[#a1a1a6]">
            <motion.span
              key={board.cards.length}
              className="inline-block"
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: appleEase }}
            >
              {board.cards.length === 1
                ? "1 task"
                : `${board.cards.length} tasks`}
            </motion.span>
            <span className="mx-1.5 text-black/20 dark:text-white/20">·</span>
            {board.columns.length} columns
          </p>
        </div>
      </motion.header>

      {notice ? (
        <p role="status" className="px-4 pt-3 text-[13px] text-destructive sm:px-6">
          {notice}
        </p>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveCardId(null)}
      >
        <div className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          {board.columns.map((column, index) => (
            <BoardColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              index={index}
              cards={cardsInColumn(board, column.id)}
              canRemove={board.columns.length > 1}
              onRename={(title) =>
                applyBoard(setBoard, renameColumn(board, column.id, title), setNotice)
              }
              onRemove={() =>
                applyBoard(setBoard, removeColumn(board, column.id), setNotice)
              }
              onAddCard={(title) =>
                applyBoard(setBoard, addCard(board, column.id, title), setNotice)
              }
              onRenameCard={(cardId, title) =>
                applyBoard(setBoard, renameCard(board, cardId, title), setNotice)
              }
              onRemoveCard={(cardId) => setBoard(removeCard(board, cardId))}
            />
          ))}
          <AddColumn
            index={board.columns.length}
            onAdd={(title) => applyBoard(setBoard, addColumn(board, title), setNotice)}
          />
        </div>

        <DragOverlay>
          {activeCard ? (
            <article className="rotate-[1.5deg] rounded-[11px] border border-border bg-background px-3 py-3 text-[14px] text-foreground shadow-[0_16px_40px_rgb(15_15_15/0.16)]">
              {activeCard.title}
            </article>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function BoardColumn({
  columnId,
  title,
  index,
  cards,
  canRemove,
  onRename,
  onRemove,
  onAddCard,
  onRenameCard,
  onRemoveCard,
}: {
  columnId: string
  title: string
  index: number
  cards: BoardCard[]
  canRemove: boolean
  onRename: (title: string) => boolean
  onRemove: () => void
  onAddCard: (title: string) => boolean
  onRenameCard: (cardId: string, title: string) => boolean
  onRemoveCard: (cardId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnDndId(columnId) })
  const itemIds = useMemo(() => cards.map((card) => cardDndId(card.id)), [cards])
  const reduced = useReducedMotion()

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: appleDuration.ui,
        delay: reduced ? 0 : Math.min(index * 0.07, 0.28),
        ease: appleEase,
      }}
      className={cn(
        "flex w-[min(300px,86vw)] shrink-0 snap-start flex-col rounded-[16px] bg-[#f3f3f5] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] dark:bg-[#1c1c1e]",
        isOver &&
          "-translate-y-1 bg-[#ececf0] shadow-[0_10px_28px_rgb(0_0_0/0.08)] outline outline-2 outline-offset-2 outline-apple-primary dark:bg-[#242426]"
      )}
    >
      <header className="flex items-start gap-1 px-2 pt-2">
        <label className="sr-only" htmlFor={`column-title-${columnId}`}>
          Column title
        </label>
        <input
          id={`column-title-${columnId}`}
          defaultValue={title}
          key={title}
          onBlur={(event) => {
            if (event.target.value.trim() === title) return
            if (!onRename(event.target.value)) event.target.value = title
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur()
          }}
          className="min-h-11 min-w-0 flex-1 rounded-[8px] bg-transparent px-2 text-[14px] font-semibold text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <span className="mt-2.5 me-1 min-w-6 text-center text-[12px] text-[#4a4a4a] dark:text-[#a1a1a6]">
          {cards.length}
        </span>
        {canRemove ? (
          <button
            type="button"
            aria-label={`Delete ${title} column`}
            onClick={onRemove}
            className="flex size-11 shrink-0 items-center justify-center rounded-[8px] text-[#4a4a4a] transition-colors hover:bg-black/6 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:text-[#a1a1a6] dark:hover:bg-white/8"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        ) : null}
      </header>

      <div
        ref={setNodeRef}
        className="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto px-2 py-2"
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence initial={false}>
            {cards.length === 0 ? (
              <motion.p
                key="empty"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-[12px] border border-dashed border-black/12 px-2 py-8 text-center text-[13px] text-[#4a4a4a] transition-colors duration-200 dark:border-white/14 dark:text-[#a1a1a6]",
                  isOver && "border-apple-primary bg-apple-primary/8 text-foreground"
                )}
              >
                No tasks in {title}
              </motion.p>
            ) : (
              cards.map((card) => (
                <BoardCardItem
                  key={card.id}
                  card={card}
                  onRename={(next) => onRenameCard(card.id, next)}
                  onRemove={() => onRemoveCard(card.id)}
                />
              ))
            )}
          </AnimatePresence>
        </SortableContext>
        <AddCard onAdd={onAddCard} />
      </div>
    </motion.section>
  )
}

function BoardCardItem({
  card,
  onRename,
  onRemove,
}: {
  card: BoardCard
  onRename: (title: string) => boolean
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardDndId(card.id) })
  const reduced = useReducedMotion()

  return (
    <motion.article
      ref={setNodeRef}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.35 : 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.32, ease: appleEase }}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-start gap-1 rounded-[11px] border border-border bg-background px-1 py-1 transition-shadow duration-200",
        !isDragging &&
          "hover:-translate-y-px hover:shadow-[0_6px_16px_rgb(0_0_0/0.06)]"
      )}
    >
      <button
        type="button"
        aria-label={`Drag ${card.title}`}
        className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-[8px] text-[#4a4a4a] hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing dark:text-[#a1a1a6] dark:hover:bg-white/8"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden />
      </button>
      <label className="sr-only" htmlFor={`card-title-${card.id}`}>
        Task title
      </label>
      <textarea
        id={`card-title-${card.id}`}
        defaultValue={card.title}
        key={card.title}
        rows={2}
        onBlur={(event) => {
          const next = event.target.value.replace(/\s+/g, " ").trim()
          if (next === card.title) return
          if (!onRename(event.target.value)) event.target.value = card.title
        }}
        className="min-h-11 min-w-0 flex-1 resize-none bg-transparent py-2.5 pr-1 text-[14px] leading-snug text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <button
        type="button"
        aria-label={`Delete ${card.title}`}
        onClick={onRemove}
        className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-[8px] text-[#4a4a4a] hover:bg-black/6 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:text-[#a1a1a6] dark:hover:bg-white/8"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </motion.article>
  )
}

function AddCard({ onAdd }: { onAdd: (title: string) => boolean }) {
  const fieldId = useId()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  function submit() {
    if (!title.trim()) {
      setError("Write a task title first.")
      return
    }
    const ok = onAdd(title)
    if (!ok) {
      setError("Write a task title first.")
      return
    }
    setTitle("")
    setError("")
    setOpen(false)
  }

  const reduced = useReducedMotion()

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="open"
            type="button"
            onClick={() => setOpen(true)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[11px] px-2 text-[13px] text-[#4a4a4a] transition-colors hover:bg-black/6 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:text-[#a1a1a6] dark:hover:bg-white/8"
          >
            <Plus className="size-4" aria-hidden />
            Add task
          </motion.button>
        ) : (
          <motion.form
            key="form"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: appleDuration.ui, ease: appleEase }}
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
      <label className="sr-only" htmlFor={fieldId}>
        New task title
      </label>
      <textarea
        id={fieldId}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value)
          if (error) setError("")
        }}
        autoFocus
        rows={2}
        placeholder="Task title"
        className="min-h-11 w-full resize-none rounded-[11px] border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none placeholder:text-[#5c5c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:placeholder:text-[#a1a1a6]"
      />
      {error ? (
        <p role="alert" className="text-[12px] text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-apple-primary px-4 text-[13px] text-white hover:bg-apple-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-primary-focus"
        >
          Add task
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setTitle("")
            setError("")
          }}
          className="inline-flex h-11 items-center justify-center rounded-[11px] px-4 text-[13px] text-foreground hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:bg-white/8"
        >
          Cancel
        </button>
      </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function AddColumn({
  onAdd,
  index,
}: {
  onAdd: (title: string) => boolean
  index: number
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  function submit() {
    if (!title.trim()) {
      setError("Name the column before adding it.")
      return
    }
    const ok = onAdd(title)
    if (!ok) {
      setError("Name the column before adding it.")
      return
    }
    setTitle("")
    setError("")
    setOpen(false)
  }

  const reduced = useReducedMotion()

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: appleDuration.ui,
        delay: reduced ? 0 : Math.min(index * 0.07, 0.28),
        ease: appleEase,
      }}
      className="w-[min(300px,86vw)] shrink-0 snap-start"
    >
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.form
            key="form"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: appleDuration.ui, ease: appleEase }}
            className="flex flex-col gap-2 rounded-[16px] bg-[#f3f3f5] p-3 dark:bg-[#1c1c1e]"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
          <label htmlFor="new-column-title" className="text-[13px] font-medium text-foreground">
            Column name
          </label>
          <input
            id="new-column-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError("")
            }}
            autoFocus
            placeholder="Review, Blocked, Waiting"
            className="h-11 rounded-[11px] border border-input bg-background px-3 text-[14px] text-foreground outline-none placeholder:text-[#5c5c5c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:placeholder:text-[#a1a1a6]"
          />
          {error ? (
            <p role="alert" className="text-[12px] text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-apple-primary px-4 text-[13px] text-white hover:bg-apple-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-primary-focus"
            >
              Add column
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setTitle("")
                setError("")
              }}
              className="inline-flex h-11 items-center justify-center rounded-[11px] px-4 text-[13px] text-foreground hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:bg-white/8"
            >
              Cancel
            </button>
          </div>
          </motion.form>
        ) : (
          <motion.button
            key="open"
            type="button"
            onClick={() => setOpen(true)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[16px] bg-[#f3f3f5] px-3 text-[14px] text-[#4a4a4a] transition-colors hover:bg-[#e8e8ec] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-[#1c1c1e] dark:text-[#a1a1a6] dark:hover:bg-[#2a2a2c]"
          >
            <Plus className="size-4" aria-hidden />
            Add column
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
