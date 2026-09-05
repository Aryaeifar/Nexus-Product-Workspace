const columns = [
  {
    title: "Todo",
    count: 4,
    cards: [
      {
        id: "DS-038",
        title: "Build command menu states",
        team: "Design system",
        mark: "N",
      },
    ],
  },
  {
    title: "In progress",
    count: 3,
    cards: [
      {
        id: "PRD-142",
        title: "Finalize onboarding flow",
        team: "Product",
        mark: "N",
      },
    ],
  },
  {
    title: "In review",
    count: 2,
    cards: [
      {
        id: "ENG-204",
        title: "Sync activity timeline",
        team: "Engineering",
        mark: "N",
      },
      {
        id: "OPS-091",
        title: "Invite workspace admins",
        team: "Operations",
        mark: "N",
      },
    ],
  },
]

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_24px_80px_-24px_rgba(15,15,15,0.28)]">
      <div className="flex min-h-[420px]">
        <aside className="hidden w-[220px] shrink-0 border-e border-black/6 bg-[#fafafa] p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
              V
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12px] font-medium">Vela / Product workspace</p>
              <p className="truncate text-[11px] text-muted-foreground">Acme team</p>
            </div>
          </div>
          <div className="space-y-0.5 text-[12px]">
            <Row label="Inbox" badge="4" />
            <Row label="My issues" active />
            <Row label="Roadmap" />
            <Row label="Knowledge" />
          </div>
          <p className="mt-5 px-2 text-[10px] font-medium tracking-[0.14em] text-muted-foreground">
            WORKSPACE
          </p>
          <div className="mt-1 space-y-0.5 text-[12px]">
            <Row label="Members" />
            <Row label="Permissions" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/6 px-4 py-2.5">
            <div>
              <p className="text-[13px] font-medium">Product / Q3 launch</p>
              <p className="text-[11px] text-muted-foreground">Current cycle</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-black/8 bg-[#f7f7f7] px-2 py-1 text-[11px] text-muted-foreground">
              Search
              <kbd className="rounded border border-black/8 bg-white px-1 font-mono text-[10px]">
                ⌘K
              </kbd>
            </div>
          </div>
          <div className="flex gap-4 border-b border-black/6 px-4 text-[12px]">
            <Tab label="Board" count="12" active />
            <Tab label="List" />
            <Tab label="Timeline" />
            <Tab label="Activity" />
          </div>
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="rounded-xl bg-[#f6f6f6] p-2">
                <div className="mb-2 flex items-center justify-between px-1 text-[11px]">
                  <span className="font-medium">{column.title}</span>
                  <span className="text-muted-foreground">{column.count}</span>
                </div>
                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <article
                      key={card.id}
                      className="rounded-lg border border-black/6 bg-white p-2.5 shadow-sm"
                    >
                      <p className="font-mono text-[10px] text-muted-foreground">{card.id}</p>
                      <p className="mt-1 text-[12px] leading-snug font-medium">{card.title}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{card.team}</span>
                        <span className="flex size-5 items-center justify-center rounded-full bg-foreground/90 text-[9px] text-background">
                          {card.mark}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  badge,
  active,
}: {
  label: string
  badge?: string
  active?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
        active ? "bg-black/6 font-medium text-foreground" : "text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      {badge ? (
        <span className="rounded-full bg-foreground px-1.5 text-[10px] text-background">
          {badge}
        </span>
      ) : null}
    </div>
  )
}

function Tab({
  label,
  count,
  active,
}: {
  label: string
  count?: string
  active?: boolean
}) {
  return (
    <span
      className={`border-b-2 py-2.5 ${
        active
          ? "border-foreground font-medium text-foreground"
          : "border-transparent text-muted-foreground"
      }`}
    >
      {label}
      {count ? <span className="ms-1 text-muted-foreground">{count}</span> : null}
    </span>
  )
}
