import { WorkspaceShell } from "@/components/workspace/workspace-shell"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WorkspaceShell>{children}</WorkspaceShell>
}
