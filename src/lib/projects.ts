export type Project = {
  id: string
  name: string
  slug: string
  createdAt: string
}

export const PROJECTS_STORAGE_KEY = "nexus.projects.v1"

export function slugifyProjectName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")

  return slug || "projekt"
}

export function uniqueProjectSlug(base: string, existingSlugs: string[]) {
  if (!existingSlugs.includes(base)) return base

  let suffix = 2
  let candidate = `${base}_${suffix}`
  while (existingSlugs.includes(candidate)) {
    suffix += 1
    candidate = `${base}_${suffix}`
  }
  return candidate
}

export function parseProjects(raw: string | null): Project[] {
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is Project => {
      if (!item || typeof item !== "object") return false
      const project = item as Partial<Project>
      return (
        typeof project.id === "string" &&
        typeof project.name === "string" &&
        typeof project.slug === "string" &&
        typeof project.createdAt === "string"
      )
    })
  } catch {
    return []
  }
}

export function createProjectRecord(
  name: string,
  existing: Project[],
  now = new Date()
): { project: Project } | { error: string } {
  const trimmed = name.trim()
  if (!trimmed) {
    return { error: "Name the project before creating it." }
  }

  const slug = uniqueProjectSlug(
    slugifyProjectName(trimmed),
    existing.map((project) => project.slug)
  )

  return {
    project: {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${now.getTime()}-${slug}`,
      name: trimmed,
      slug,
      createdAt: now.toISOString(),
    },
  }
}
