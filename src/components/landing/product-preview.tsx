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
    <div className="shadow-product overflow-hidden rounded-[18px] border border-apple-hairline bg-apple-canvas">
      <div className="flex min-h-[420px] text-left">
        <aside className="hidden w-[220px] shrink-0 border-e border-apple-hairline bg-apple-parchment p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-6 items-center justify-center rounded-[8px] bg-apple-ink text-[11px] font-semibold text-white">
              N
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12px] font-semibold tracking-[-0.12px]">
                Nexus / Workspace
              </p>
              <p className="truncate text-[11px] text-apple-ink-muted-48">Acme team</p>
            </div>
          </div>
          <div className="space-y-0.5 text-[12px]">
            <Row label="Inbox" badge="4" />
            <Row label="My issues" active />
            <Row label="Roadmap" />
            <Row label="Knowledge" />
          </div>
          <p className="mt-5 px-2 text-[10px] font-semibold tracking-[0.08em] text-apple-ink-muted-48">
            WORKSPACE
          </p>
          <div className="mt-1 space-y-0.5 text-[12px]">
            <Row label="Members" />
            <Row label="Permissions" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-apple-hairline px-4 py-2.5">
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.12px]">
                Product / Q3 launch
              </p>
              <p className="text-[11px] text-apple-ink-muted-48">Current cycle</p>
            </div>
            <div className="flex h-8 items-center gap-1.5 rounded-full border border-black/8 bg-apple-canvas px-3 text-[12px] text-apple-ink-muted-48">
              Search
              <kbd className="text-[10px] tracking-[-0.08px]">⌘K</kbd>
            </div>
          </div>
          <div className="flex gap-5 border-b border-apple-hairline px-4 text-[12px]">
            <Tab label="Board" count="12" active />
            <Tab label="List" />
            <Tab label="Timeline" />
            <Tab label="Activity" />
          </div>
          <div className="grid grid-cols-1 gap-3 bg-apple-parchment p-3 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="p-1">
                <div className="mb-2 flex items-center justify-between px-1 text-[11px]">
                  <span className="font-semibold">{column.title}</span>
                  <span className="text-apple-ink-muted-48">{column.count}</span>
                </div>
                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <article
                      key={card.id}
                      className="rounded-[8px] border border-apple-hairline bg-apple-canvas p-2.5"
                    >
                      <p className="font-mono text-[10px] text-apple-ink-muted-48">
                        {card.id}
                      </p>
                      <p className="mt-1 text-[12px] leading-snug font-semibold">
                        {card.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-apple-ink-muted-48">
                        <span>{card.team}</span>
                        <span className="flex size-5 items-center justify-center rounded-full bg-apple-ink text-[9px] text-white">
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
      className={`flex items-center justify-between rounded-[8px] px-2 py-1.5 ${
        active ? "bg-black/6 font-semibold text-apple-ink" : "text-apple-ink-muted-48"
      }`}
    >
      <span>{label}</span>
      {badge ? (
        <span className="rounded-full bg-apple-ink px-1.5 text-[10px] text-white">
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
          ? "border-apple-primary font-semibold text-apple-ink"
          : "border-transparent text-apple-ink-muted-48"
      }`}
    >
      {label}
      {count ? <span className="ms-1 text-apple-ink-muted-48">{count}</span> : null}
    </span>
  )
}
