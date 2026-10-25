import { PageBreadcrumb } from "@/components/workspace/page-breadcrumb"
import { PageTransition } from "@/components/workspace/page-transition"
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
        <div className="bg-background flex h-full flex-col overflow-hidden rounded-[20px] border border-black/5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:border-white/8 dark:shadow-[0_8px_30px_rgb(0_0_0/0.28)]">
          <PageBreadcrumb className="shrink-0 px-6 pt-4 pb-2" />
          <div className="min-h-0 flex-1">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
        <style>{`
          @keyframes page-enter {
            from {
              opacity: 0;
              filter: blur(1rem);
            }
          }
          @keyframes page-leave {
            to {
              opacity: 0;
              filter: blur(1rem);
            }
          }
          .page-enter {
            animation: page-enter 0.6s ease both;
          }
          .page-leave {
            animation: page-leave 0.6s ease both;
          }
        `}</style>
      </main>
    </div>
  )
}
