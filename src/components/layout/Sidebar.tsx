/**
 * Sidebar Navigation Component
 * Persistent sidebar with links to Dashboard, Browse Grants, and Search History
 * Will be integrated into root layout
 */
export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Grant Advisor</h2>
        <nav className="mt-4 space-y-2">
          <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-muted">
            Dashboard
          </a>
          <a href="/grants" className="block px-3 py-2 rounded hover:bg-muted">
            Browse Grants
          </a>
          <a href="/history" className="block px-3 py-2 rounded hover:bg-muted">
            Search History
          </a>
        </nav>
      </div>
    </aside>
  );
}
