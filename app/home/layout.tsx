import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh bg-sidebar">
      <WorkspaceSidebar />
      <main className="min-w-0 flex-1 p-2 ps-0">
        <div className="bg-background h-full overflow-y-auto rounded-[20px] border border-black/5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:border-white/8 dark:shadow-[0_8px_30px_rgb(0_0_0/0.28)]">
          {children}
        </div>
      </main>
    </div>
  )
}
