import { WorkspaceShell } from "@/components/workspace/workspace-shell"

export default function ProjektsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WorkspaceShell>{children}</WorkspaceShell>
}
