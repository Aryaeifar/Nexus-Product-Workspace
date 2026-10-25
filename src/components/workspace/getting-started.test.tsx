import { act, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test } from "vitest"

import { GettingStarted } from "@/components/workspace/getting-started"

const STORAGE_KEY = "nexus.home.todos.v2"

const TODOS = [
  { id: "first", title: "First", done: false },
  { id: "second", title: "Second", done: false },
]

function installStackedRows() {
  const original = HTMLElement.prototype.getBoundingClientRect

  HTMLElement.prototype.getBoundingClientRect = function () {
    if (!this.classList.contains("group")) return original.call(this)

    const rows = [...document.querySelectorAll("div.group")]
    const index = rows.indexOf(this)
    if (index < 0) return original.call(this)

    const top = index * 48
    return DOMRect.fromRect({ x: 0, y: top, width: 320, height: 40 })
  }

  return () => {
    HTMLElement.prototype.getBoundingClientRect = original
  }
}

const visibleBrowser = !navigator.userAgent.includes("jsdom")

function pause(ms = 700) {
  if (!visibleBrowser) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function press(code: string) {
  const target = document.activeElement ?? document.body
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      code,
      key: code === "Space" ? " " : code,
    })
  )
}

beforeEach(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(TODOS))
})

afterEach(() => {
  localStorage.clear()
})

test("reorders tasks with the keyboard drag", async () => {
  const restoreLayout = visibleBrowser ? null : installStackedRows()

  try {
    render(<GettingStarted />)

    expect(await screen.findByDisplayValue("First")).toBeInTheDocument()
    await pause()
    const handles = screen.getAllByRole("button", { name: "Drag to reorder" })
    handles[0]?.focus()

    // dnd-kit reads event.code, then attaches its move listener on the next tick.
    await act(async () => {
      press("Space")
    })
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    await pause()
    await act(async () => {
      press("ArrowDown")
    })
    await pause()
    await act(async () => {
      press("Space")
    })
    await pause(1200)

    const titles = screen
      .getAllByRole("textbox")
      .map((input) => (input as HTMLInputElement).value)
    expect(titles).toEqual(["Second", "First"])

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
      title: string
    }[]
    expect(stored.map((todo) => todo.title)).toEqual(["Second", "First"])
  } finally {
    restoreLayout?.()
  }
})
