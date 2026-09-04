const metrics = [
  { label: "Applications", value: "1,284", detail: "+8.2% this month" },
  { label: "Awaiting approval", value: "58", detail: "12 beyond target" },
  { label: "Ready for disbursement", value: "17", detail: "₦842.5m pipeline" },
  { label: "Active portfolio", value: "₦18.7bn", detail: "4,812 loans" },
];

const exceptions = [
  { title: "Reconciliation mismatch", detail: "₦38.4m across 23 bank transactions", tone: "critical" },
  { title: "Missing documents", detail: "42 applications need customer follow-up", tone: "warning" },
  { title: "Approval SLA", detail: "8 cases have waited more than 48 hours", tone: "warning" },
  { title: "Insurance renewals", detail: "4 collateral policies expire this month", tone: "neutral" },
];

const pipeline = [
  ["Document review", 186],
  ["Credit review", 146],
  ["Property review", 73],
  ["Underwriting", 48],
  ["Approval", 58],
  ["Conditions", 31],
];

function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--border)] bg-[var(--navy)] text-white lg:block">
        <div className="flex h-full flex-col p-5">
          <div className="mb-10">
            <div className="text-xl font-bold tracking-tight">MortgageOps</div>
            <div className="mt-1 text-xs text-slate-300">Mortgage Operations Platform</div>
          </div>
          <nav className="space-y-1 text-sm">
            {[
              ["Overview", true],
              ["Applications", false],
              ["Credit & Underwriting", false],
              ["Properties", false],
              ["Approvals", false],
              ["Disbursements", false],
              ["Loans & Ledger", false],
              ["Reconciliation", false],
              ["Collections", false],
              ["Risk & Compliance", false],
              ["Reports", false],
            ].map(([label, active]) => (
              <div
                key={String(label)}
                className={`rounded-lg px-3 py-2.5 ${active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"}`}
              >
                {String(label)}
              </div>
            ))}
          </nav>
          <div className="mt-auto border-t border-white/10 pt-4 text-xs text-slate-400">
            Prototype · Internal workspace
          </div>
        </div>
      </aside>

      <section className="lg:pl-64">
        <header className="border-b border-[var(--border)] bg-white">
          <div className="flex items-center justify-between px-6 py-5 lg:px-8">
            <div>
              <div className="text-sm text-[var(--muted)]">Operations</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Mortgage control tower</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Friday, 4 September 2026 · Abuja operations</p>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <button className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700">Search cases</button>
              <button className="rounded-lg bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">New application</button>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6 lg:p-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
                <div className="text-sm text-[var(--muted)]">{metric.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</div>
                <div className="mt-2 text-xs text-[var(--muted)]">{metric.detail}</div>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">Application pipeline</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">Open mortgage cases by current workflow stage.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Live view</span>
              </div>
              <div className="mt-7 space-y-5">
                {pipeline.map(([label, count]) => (
                  <div key={String(label)}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-700">{String(label)}</span>
                      <span className="font-medium">{formatCount(Number(count))}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-slate-700" style={{ width: `${Math.min(Number(count) / 2, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div>
                <h2 className="font-semibold">Exceptions needing attention</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">The cases most likely to block operations today.</p>
              </div>
              <div className="mt-5 space-y-3">
                {exceptions.map((exception) => (
                  <div key={exception.title} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${exception.tone === "critical" ? "bg-red-600" : exception.tone === "warning" ? "bg-amber-500" : "bg-slate-400"}`} />
                      <div className="text-sm font-medium">{exception.title}</div>
                    </div>
                    <div className="mt-2 text-xs leading-5 text-[var(--muted)]">{exception.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div>
                <h2 className="font-semibold">Recent mortgage cases</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">A unified queue for applications moving through the bank.</p>
              </div>
              <button className="text-sm font-medium text-slate-700">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Case</th>
                    <th className="px-6 py-3 font-medium">Applicant</th>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Stage</th>
                    <th className="px-6 py-3 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["MTG-2026-004821", "John Adewale", "Home Purchase", "₦85.0m", "Underwriting", "Credit"],
                    ["MTG-2026-004817", "Mary Okafor", "Home Purchase", "₦62.5m", "Approval", "Credit Committee"],
                    ["MTG-2026-004806", "Emeka Okoro", "Home Improvement", "₦24.0m", "Property Review", "Legal"],
                    ["MTG-2026-004799", "Aisha Bello", "First Home", "₦41.5m", "Disbursement Ready", "Finance"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-[var(--border)] hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{row[0]}</td>
                      <td className="whitespace-nowrap px-6 py-4">{row[1]}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">{row[2]}</td>
                      <td className="whitespace-nowrap px-6 py-4">{row[3]}</td>
                      <td className="whitespace-nowrap px-6 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">{row[4]}</span></td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">{row[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
