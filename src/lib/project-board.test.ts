import { expect, test } from "vitest"

import {
  addCard,
  addColumn,
  emptyBoard,
  moveCard,
  parseBoard,
  removeColumn,
  cardsInColumn,
} from "@/lib/project-board"

test("emptyBoard seeds the four starter columns", () => {
  const board = emptyBoard()
  expect(board.columns.map((column) => column.title)).toEqual([
    "Not started",
    "In progress",
    "Done",
    "Canceled",
  ])
  expect(board.cards).toEqual([])
})

test("moveCard relocates a task between columns", () => {
  const started = addCard(emptyBoard(), "not_started", "Write brief")
  if ("error" in started) throw new Error(started.error)

  const moved = moveCard(started.board, started.board.cards[0]!.id, "done", 0)
  expect(cardsInColumn(moved, "not_started")).toHaveLength(0)
  expect(cardsInColumn(moved, "done").map((card) => card.title)).toEqual([
    "Write brief",
  ])
})

test("addColumn rejects a blank title", () => {
  expect(addColumn(emptyBoard(), "  ")).toEqual({
    error: "Name the column before adding it.",
  })
})

test("removeColumn keeps one column and moves its cards", () => {
  const withCard = addCard(emptyBoard(), "canceled", "Drop this")
  if ("error" in withCard) throw new Error(withCard.error)

  const result = removeColumn(withCard.board, "canceled")
  if ("error" in result) throw new Error(result.error)
  expect(result.board.columns.some((column) => column.id === "canceled")).toBe(
    false
  )
  expect(result.board.cards[0]?.columnId).toBe("not_started")
})

test("parseBoard rejects a board with no columns", () => {
  expect(parseBoard({ columns: [], cards: [] })).toBeNull()
})
