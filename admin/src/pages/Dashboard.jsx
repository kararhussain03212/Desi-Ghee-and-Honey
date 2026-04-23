import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const moduleConfig = [
  { key: 'services', label: 'Services', badge: 'Live' },
  { key: 'products', label: 'Products', badge: 'Catalog' },
  { key: 'team', label: 'Team Members', badge: 'People' },
  { key: 'testimonials', label: 'Testimonials', badge: 'Reviews' },
  { key: 'blog', label: 'Blogs', badge: 'Content' },
  { key: 'hero', label: 'Hero Slides', badge: 'Hero' },
  { key: 'gallery', label: 'Gallery', badge: 'Media' },
  { key: 'stats', label: 'Stats', badge: 'Insights' },
]

const quickStats = [
  { key: 'total', label: 'Total Entries', pill: 'Live' },
  { key: 'active', label: 'Published', pill: 'Online' },
  { key: 'pending', label: 'Pending Review', pill: 'Queue' },
  { key: 'sections', label: 'Sections Available', pill: 'Modules' },
]

export default function Dashboard() {
  const logout = useAuthStore((state) => state.logout)

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard')
      return response.data?.data
    },
  })

  const counts = data?.counts || {}
  const totalEntries = Object.values(counts).reduce((acc, value) => acc + Number(value || 0), 0)
  const activeEntries = totalEntries
  const pendingEntries = 0
  const sectionCount = Object.keys(counts).length
  const lastUpdated = new Date().toLocaleString()

  const quickStatValues = {
    total: totalEntries,
    active: activeEntries,
    pending: pendingEntries,
    sections: sectionCount,
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-950/90 p-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600/30 text-indigo-300">S</div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Admin Panel</p>
              <h2 className="text-xl font-semibold">SWIFT</h2>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">Main</p>
            <button className="w-full rounded-lg bg-slate-800 px-3 py-2 text-left text-slate-100">Dashboard</button>
            {moduleConfig.slice(0, 6).map((item) => (
              <button key={item.key} className="w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-900">
                {item.label}
              </button>
            ))}
            <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-slate-500">Global</p>
            {moduleConfig.slice(6).map((item) => (
              <button key={item.key} className="w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-slate-900">
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 md:p-6">
          <header className="mb-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-cyan-950 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-300">Professional overview of your admin content health.</p>
                <p className="mt-2 text-xs text-slate-400">Last updated: {lastUpdated}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => refetch()}
                  className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-70"
                  disabled={isFetching}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh Data'}
                </button>
                <button onClick={logout} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500">
                  Logout
                </button>
              </div>
            </div>
          </header>

          {isLoading ? <p className="mb-4 text-sm text-slate-300">Loading dashboard...</p> : null}
          {error ? <p className="mb-4 text-sm text-rose-300">Failed to fetch dashboard data.</p> : null}

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickStats.map((stat) => (
              <article key={stat.key} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300">
                    {stat.pill}
                  </span>
                </div>
                <p className="text-3xl font-semibold">{quickStatValues[stat.key]}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moduleConfig.map((item) => {
              const value = Number(counts[item.key] || 0)
              const livePct = value > 0 ? 100 : 0
              return (
                <article key={item.key} className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-medium">{item.label}</h3>
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                      {item.badge}
                    </span>
                  </div>

                  <div className="mb-2 flex items-end justify-between">
                    <p className="text-3xl font-semibold">{value}</p>
                    <p className="text-xs text-slate-400">{livePct}% live</p>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${livePct}%` }} />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800">
                      Open Section
                    </button>
                    <button className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800">
                      Add New
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
