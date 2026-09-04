import Link from "next/link";

const applications = [
  { id: "MTG-2026-004821", applicant: "John Adewale", product: "Home Purchase", amount: "₦85.0m", status: "UNDERWRITING", owner: "Credit", updated: "09:32" },
  { id: "MTG-2026-004817", applicant: "Mary Okafor", product: "Home Purchase", amount: "₦62.5m", status: "APPROVAL", owner: "Credit Committee", updated: "09:10" },
  { id: "MTG-2026-004806", applicant: "Emeka Okoro", product: "Home Improvement", amount: "₦24.0m", status: "PROPERTY_REVIEW", owner: "Legal", updated: "08:48" },
  { id: "MTG-2026-004799", applicant: "Aisha Bello", product: "First Home", amount: "₦41.5m", status: "DISBURSEMENT_READY", owner: "Finance", updated: "Yesterday" },
  { id: "MTG-2026-004792", applicant: "Samuel Eze", product: "Home Purchase", amount: "₦105.0m", status: "DOCUMENT_REVIEW", owner: "Mortgage Officer", updated: "Yesterday" },
  { id: "MTG-2026-004781", applicant: "Fatima Musa", product: "Affordable Housing", amount: "₦32.0m", status: "CREDIT_REVIEW", owner: "Credit", updated: "02 Sep" },
];

function label(status: string) {
  return status.replaceAll("_", " ");
}

export default function ApplicationsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link href="/" className="text-sm text-[var(--muted)]">← Control tower</Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Mortgage applications</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Manage the full application queue and move each case to its next controlled step.</p>
          </div>
          <Link href="/applications/new" className="rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white">New application</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 p-6 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-4">
          {[
            ["Open cases", "1,284"],
            ["Due today", "34"],
            ["Blocked", "27"],
            ["Ready to approve", "58"],
          ].map(([name, value]) => (
            <div key={name} className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
              <div className="text-sm text-[var(--muted)]">{name}</div>
              <div className="mt-2 text-2xl font-semibold">{value}</div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-3">
              <input aria-label="Search applications" placeholder="Search case number or customer" className="w-full max-w-md rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-slate-400" />
              <select aria-label="Filter by status" className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                <option>All statuses</option>
                <option>Document review</option>
                <option>Credit review</option>
                <option>Property review</option>
                <option>Underwriting</option>
                <option>Approval</option>
                <option>Disbursement ready</option>
              </select>
            </div>
            <span className="text-xs text-[var(--muted)]">Showing 6 sample cases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Case</th>
                  <th className="px-5 py-3 font-medium">Applicant</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Stage</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((item) => (
                  <tr key={item.id} className="border-t border-[var(--border)] hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 font-medium">{item.id}</td>
                    <td className="whitespace-nowrap px-5 py-4">{item.applicant}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{item.product}</td>
                    <td className="whitespace-nowrap px-5 py-4">{item.amount}</td>
                    <td className="whitespace-nowrap px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium uppercase">{label(item.status)}</span></td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{item.owner}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">{item.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
