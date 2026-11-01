export type BoardColumn = {
  id: string
  title: string
}

export type BoardCard = {
  id: string
  columnId: string
  title: string
}

export type ProjectBoard = {
  columns: BoardColumn[]
  cards: BoardCard[]
}

export const PROJECT_BOARDS_STORAGE_KEY = "nexus.project-boards.v1"

export const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: "not_started", title: "Not started" },
  { id: "in_progress", title: "In progress" },
  { id: "done", title: "Done" },
  { id: "canceled", title: "Canceled" },
]

export function emptyBoard(): ProjectBoard {
  return {
    columns: DEFAULT_COLUMNS.map((column) => ({ ...column })),
    cards: [],
  }
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function cardsInColumn(board: ProjectBoard, columnId: string) {
  return board.cards.filter((card) => card.columnId === columnId)
}

export function addColumn(
  board: ProjectBoard,
  title: string
): { board: ProjectBoard } | { error: string } {
  const trimmed = title.trim()
  if (!trimmed) return { error: "Name the column before adding it." }

  return {
    board: {
      ...board,
      columns: [...board.columns, { id: newId(), title: trimmed }],
    },
  }
}

export function renameColumn(
  board: ProjectBoard,
  columnId: string,
  title: string
): { board: ProjectBoard } | { error: string } {
  const trimmed = title.trim()
  if (!trimmed) return { error: "A column needs a name." }
  if (!board.columns.some((column) => column.id === columnId)) {
    return { error: "That column is gone." }
  }

  return {
    board: {
      ...board,
      columns: board.columns.map((column) =>
        column.id === columnId ? { ...column, title: trimmed } : column
      ),
    },
  }
}

export function removeColumn(
  board: ProjectBoard,
  columnId: string
): { board: ProjectBoard } | { error: string } {
  if (board.columns.length <= 1) {
    return { error: "Keep at least one column." }
  }

  const fallback = board.columns.find((column) => column.id !== columnId)
  if (!fallback) return { error: "Keep at least one column." }

  return {
    board: {
      columns: board.columns.filter((column) => column.id !== columnId),
      cards: board.cards.map((card) =>
        card.columnId === columnId ? { ...card, columnId: fallback.id } : card
      ),
    },
  }
}

export function addCard(
  board: ProjectBoard,
  columnId: string,
  title: string
): { board: ProjectBoard } | { error: string } {
  const trimmed = title.trim()
  if (!trimmed) return { error: "Write a task title first." }
  if (!board.columns.some((column) => column.id === columnId)) {
    return { error: "That column is gone." }
  }

  return {
    board: {
      ...board,
      cards: [...board.cards, { id: newId(), columnId, title: trimmed }],
    },
  }
}

export function renameCard(
  board: ProjectBoard,
  cardId: string,
  title: string
): { board: ProjectBoard } | { error: string } {
  const trimmed = title.trim()
  if (!trimmed) return { error: "A task needs a title." }
  if (!board.cards.some((card) => card.id === cardId)) {
    return { error: "That task is gone." }
  }

  return {
    board: {
      ...board,
      cards: board.cards.map((card) =>
        card.id === cardId ? { ...card, title: trimmed } : card
      ),
    },
  }
}

export function removeCard(board: ProjectBoard, cardId: string): ProjectBoard {
  return {
    ...board,
    cards: board.cards.filter((card) => card.id !== cardId),
  }
}

export function moveCard(
  board: ProjectBoard,
  cardId: string,
  toColumnId: string,
  toIndex: number
): ProjectBoard {
  const card = board.cards.find((item) => item.id === cardId)
  if (!card || !board.columns.some((column) => column.id === toColumnId)) {
    return board
  }

  const without = board.cards.filter((item) => item.id !== cardId)
  const destination = without.filter((item) => item.columnId === toColumnId)
  const remainder = without.filter((item) => item.columnId !== toColumnId)
  const index = Math.max(0, Math.min(toIndex, destination.length))
  destination.splice(index, 0, { ...card, columnId: toColumnId })

  return { ...board, cards: [...remainder, ...destination] }
}

export function parseBoard(raw: unknown): ProjectBoard | null {
  if (!raw || typeof raw !== "object") return null
  const value = raw as Partial<ProjectBoard>
  if (!Array.isArray(value.columns) || !Array.isArray(value.cards)) return null

  const columns = value.columns.filter((item): item is BoardColumn => {
    return (
      !!item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.title === "string"
    )
  })
  if (columns.length === 0) return null

  const columnIds = new Set(columns.map((column) => column.id))
  const cards = value.cards.filter((item): item is BoardCard => {
    return (
      !!item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.columnId === "string" &&
      columnIds.has(item.columnId)
    )
  })

  return { columns, cards }
}

export function parseBoardsRecord(raw: string | null): Record<string, ProjectBoard> {
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}

    const record: Record<string, ProjectBoard> = {}
    for (const [projectId, value] of Object.entries(parsed as Record<string, unknown>)) {
      const board = parseBoard(value)
      if (board) record[projectId] = board
    }
    return record
  } catch {
    return {}
  }
}
