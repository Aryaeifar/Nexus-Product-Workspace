import type { Metadata } from "next"

import { ProjectPage } from "@/components/workspace/project-page"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projekt_name: string }>
}): Promise<Metadata> {
  const { projekt_name } = await params
  return { title: decodeURIComponent(projekt_name) }
}

export default async function ProjektNamePage({
  params,
}: {
  params: Promise<{ projekt_name: string }>
}) {
  const { projekt_name } = await params
  return <ProjectPage slug={decodeURIComponent(projekt_name)} />
}
