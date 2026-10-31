import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

    expect(await screen.findByRole("button", { name: "Open First" })).toBeInTheDocument()
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
      .getAllByRole("button", { name: /^Open / })
      .map((button) => button.textContent)
    expect(titles).toEqual(["Second", "First"])

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
      title: string
    }[]
    expect(stored.map((todo) => todo.title)).toEqual(["Second", "First"])
  } finally {
    restoreLayout?.()
  }
})

test("play starts a fixed timer and stop hides it", async () => {
  const user = userEvent.setup()
  render(<GettingStarted />)

  expect(await screen.findByRole("button", { name: "Open First" })).toBeInTheDocument()

  await user.click(screen.getAllByRole("button", { name: "Play timer" })[0]!)
  expect(screen.getByRole("button", { name: "Start timer" })).toBeInTheDocument()
  expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()

  const pauseButtons = screen.getAllByRole("button", { name: "Pause timer" })
  await user.click(pauseButtons[pauseButtons.length - 1]!)
  expect(screen.getAllByRole("button", { name: "Play timer" }).length).toBeGreaterThan(0)

  await user.click(screen.getAllByRole("button", { name: "Stop timer" })[0]!)
  expect(screen.queryByRole("button", { name: "Start timer" })).not.toBeInTheDocument()
})

test("timer card snaps to the nearest corner after a drag", async () => {
  const user = userEvent.setup()
  render(<GettingStarted />)

  expect(await screen.findByRole("button", { name: "Open First" })).toBeInTheDocument()
  await user.click(screen.getAllByRole("button", { name: "Play timer" })[0]!)

  const card = document.querySelector("[data-corner]")
  expect(card).toHaveAttribute("data-corner", "bottom-right")
  if (!(card instanceof HTMLElement)) throw new Error("Missing timer card")

  Object.defineProperty(window, "innerWidth", { value: 1000, configurable: true })
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true })
  card.getBoundingClientRect = () =>
    DOMRect.fromRect({ x: 736, y: 672, width: 240, height: 104 })

  fireEvent.pointerDown(card, { button: 0, clientX: 800, clientY: 720 })
  fireEvent.pointerMove(card, { clientX: 80, clientY: 60 })
  fireEvent.pointerUp(card, { clientX: 80, clientY: 60 })

  expect(card).toHaveAttribute("data-corner", "top-left")

  card.getBoundingClientRect = () =>
    DOMRect.fromRect({ x: 24, y: 24, width: 240, height: 104 })

  fireEvent.pointerDown(card, { button: 0, clientX: 80, clientY: 60 })
  fireEvent.pointerMove(card, { clientX: 920, clientY: 40 })
  fireEvent.pointerUp(card, { clientX: 920, clientY: 40 })

  expect(card).toHaveAttribute("data-corner", "top-right")
})

test("right-clicking the drag handle duplicates, recolors, and deletes", async () => {
  const user = userEvent.setup()
  render(<GettingStarted />)

  expect(await screen.findByRole("button", { name: "Open First" })).toBeInTheDocument()

  async function openHandleMenu() {
    const handle = screen.getAllByRole("button", { name: "Drag to reorder" })[0]
    if (!handle) throw new Error("Missing drag handle")
    fireEvent.contextMenu(handle)
    await screen.findByRole("menuitem", { name: "Duplicate" })
  }

  async function highlight(
    name: string,
    role: "menuitem" | "menuitemradio" = "menuitem"
  ) {
    const item = screen.getByRole(role, { name })
    for (let step = 0; step < 8; step += 1) {
      if (item.hasAttribute("data-highlighted")) return
      await user.keyboard("{ArrowDown}")
    }
    throw new Error(`Could not highlight ${name}`)
  }

  async function pick(menu: "Color" | "Background", swatch: string) {
    await openHandleMenu()
    await highlight(menu)
    await user.keyboard("{Enter}")
    await screen.findByRole("menuitem", { name: menu, expanded: true })
    await highlight(swatch, "menuitemradio")
    await user.keyboard("{Enter}")
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    })
  }

  await pick("Color", "Red")
  await pick("Background", "Blue")

  await openHandleMenu()
  await user.click(screen.getByRole("menuitem", { name: "Duplicate" }))
  await waitFor(() => {
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  expect(screen.getAllByRole("button", { name: "Open First" })).toHaveLength(2)
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
    title: string
    color?: string
    background?: string
  }[]
  expect(stored.map((todo) => todo.title)).toEqual(["First", "First", "Second"])
  expect(stored[0]).toMatchObject({ color: "red", background: "blue" })
  expect(stored[1]).toMatchObject({ color: "red", background: "blue" })
  expect(stored[2]?.color).toBeUndefined()

  await openHandleMenu()
  await user.click(screen.getByRole("menuitem", { name: "Delete" }))

  await waitFor(() => {
    expect(screen.getAllByRole("button", { name: "Open First" })).toHaveLength(1)
  })
  expect(screen.getByRole("button", { name: "Open Second" })).toBeInTheDocument()
  const afterDelete = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
    title: string
  }[]
  expect(afterDelete.map((todo) => todo.title)).toEqual(["First", "Second"])
})

test("opening a task shows a modal and reset is the only way to clear time", async () => {
  const user = userEvent.setup()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([{ id: "first", title: "First", done: false, elapsedMs: 65000 }])
  )
  render(<GettingStarted />)

  await user.click(await screen.findByRole("button", { name: "Open First" }))
  expect(screen.getByRole("dialog")).toBeInTheDocument()
  expect(screen.getByDisplayValue("First")).toBeInTheDocument()
  expect(screen.getByText("01:05")).toBeInTheDocument()

  await user.click(screen.getByRole("button", { name: "Close" }))
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
    elapsedMs?: number
  }[]
  expect(stored[0]?.elapsedMs).toBe(65000)

  await user.click(screen.getByRole("button", { name: "Open First" }))
  await user.click(screen.getByRole("button", { name: "Reset time" }))
  expect(screen.getByText("00:00")).toBeInTheDocument()

  await waitFor(() => {
    const afterReset = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
      elapsedMs?: number
    }[]
    expect(afterReset[0]?.elapsedMs).toBe(0)
  })
})

test("task modal saves status, description, and labels", async () => {
  const user = userEvent.setup()
  render(<GettingStarted />)

  await user.click(await screen.findByRole("button", { name: "Open First" }))
  await user.type(screen.getByPlaceholderText("Add a description…"), "Ship notes")
  await user.click(screen.getByRole("radio", { name: "In Progress" }))
  await user.click(screen.getByRole("button", { name: "Launch" }))
  await user.click(screen.getByRole("button", { name: "Close" }))

  await waitFor(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as {
      description?: string
      status?: string
      labels?: string[]
    }[]
    expect(stored[0]).toMatchObject({
      description: "Ship notes",
      status: "in_progress",
      labels: ["Launch"],
    })
  })
})
