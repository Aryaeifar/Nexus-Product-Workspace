import { expect, test } from "vitest"

import {
  createProjectRecord,
  parseProjects,
  slugifyProjectName,
  uniqueProjectSlug,
} from "@/lib/projects"

test("slugifyProjectName uses underscores for the projekt route", () => {
  expect(slugifyProjectName("Launch Board")).toBe("launch_board")
  expect(slugifyProjectName("  Alpha  ")).toBe("alpha")
  expect(slugifyProjectName("!!!")).toBe("projekt")
})

test("uniqueProjectSlug keeps collisions distinct", () => {
  expect(uniqueProjectSlug("alpha", ["alpha"])).toBe("alpha_2")
  expect(uniqueProjectSlug("alpha", ["alpha", "alpha_2"])).toBe("alpha_3")
})

test("createProjectRecord rejects a blank name", () => {
  const result = createProjectRecord("   ", [])
  expect(result).toEqual({ error: "Name the project before creating it." })
})

test("parseProjects ignores malformed storage", () => {
  expect(parseProjects("not-json")).toEqual([])
  expect(parseProjects(JSON.stringify([{ name: "Nope" }]))).toEqual([])
})
