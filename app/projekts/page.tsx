import type { Metadata } from "next"

import { ProjectPage } from "@/components/workspace/project-page"

export const metadata: Metadata = {
  title: "Projects",
}

export default function ProjektsIndexPage() {
  return <ProjectPage />
}
