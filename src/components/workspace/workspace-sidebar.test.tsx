import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, expect, test, vi } from "vitest"

import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar"
import { ProjectsProvider } from "@/context/projects-context"
import { PROJECTS_STORAGE_KEY } from "@/lib/projects"

vi.mock("next/navigation", () => ({
  usePathname: () => "/home/inbox",
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}))

vi.mock("@/components/ui/highlighter", () => ({
  Highlighter: ({ children }: { children: ReactNode }) => children,
}))

beforeEach(() => {
  localStorage.clear()
})

test("places Projects under Inbox with a create control", async () => {
  const user = userEvent.setup()
  render(
    <ProjectsProvider>
      <WorkspaceSidebar />
    </ProjectsProvider>
  )

  const inbox = screen.getByRole("link", { name: "Inbox" })
  const projects = screen.getByRole("button", { name: "Projects" })
  expect(inbox.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(screen.getByRole("button", { name: "Create project" })).toBeInTheDocument()

  await user.click(projects)
  expect(await screen.findByText("No projects yet")).toBeInTheDocument()
})

test("shows stored projects in the tree", async () => {
  localStorage.setItem(
    PROJECTS_STORAGE_KEY,
    JSON.stringify([
      {
        id: "1",
        name: "Atlas",
        slug: "atlas",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ])
  )

  const user = userEvent.setup()
  render(
    <ProjectsProvider>
      <WorkspaceSidebar />
    </ProjectsProvider>
  )

  await user.click(screen.getByRole("button", { name: "Projects" }))
  const projectLink = await screen.findByRole("link", { name: "Atlas" })
  expect(projectLink).toHaveAttribute("href", "/projekts/atlas")
})
