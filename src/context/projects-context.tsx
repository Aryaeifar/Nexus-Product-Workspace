"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  createProjectRecord,
  parseProjects,
  PROJECTS_STORAGE_KEY,
  type Project,
} from "@/lib/projects"

export const PROJECTS_TREE_STORAGE_KEY = "nexus.projects.treeOpen"

type ProjectsContextValue = {
  projects: Project[]
  ready: boolean
  createOpen: boolean
  setCreateOpen: (open: boolean) => void
  treeOpen: boolean
  setTreeOpen: (open: boolean) => void
  createProject: (name: string) => { project: Project } | { error: string }
  projectBySlug: (slug: string) => Project | undefined
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [ready, setReady] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [treeOpen, setTreeOpenState] = useState(false)

  useEffect(() => {
    setProjects(parseProjects(localStorage.getItem(PROJECTS_STORAGE_KEY)))
    setTreeOpenState(localStorage.getItem(PROJECTS_TREE_STORAGE_KEY) === "true")
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
  }, [projects, ready])

  const setTreeOpen = useCallback((open: boolean) => {
    setTreeOpenState(open)
    localStorage.setItem(PROJECTS_TREE_STORAGE_KEY, String(open))
  }, [])

  const createProject = useCallback((name: string) => {
    const result = createProjectRecord(name, projects)
    if ("error" in result) return result
    setProjects((current) => [...current, result.project])
    setTreeOpen(true)
    return result
  }, [projects, setTreeOpen])

  const projectBySlug = useCallback(
    (slug: string) => projects.find((project) => project.slug === slug),
    [projects]
  )

  const value = useMemo(
    () => ({
      projects,
      ready,
      createOpen,
      setCreateOpen,
      treeOpen,
      setTreeOpen,
      createProject,
      projectBySlug,
    }),
    [projects, ready, createOpen, treeOpen, setTreeOpen, createProject, projectBySlug]
  )

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error("useProjects must be used inside ProjectsProvider")
  }
  return context
}
