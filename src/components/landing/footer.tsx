export function LandingFooter() {
  return (
    <footer id="pricing" className="border-t border-black/6 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Vela.work</p>
        <nav className="flex gap-5">
          <a href="#product">Product</a>
          <a href="#security">Security</a>
          <a href="#top">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
