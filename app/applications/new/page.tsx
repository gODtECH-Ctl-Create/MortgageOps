import Link from "next/link";

const fields = [
  { label: "First name", placeholder: "John", type: "text" },
  { label: "Last name", placeholder: "Adewale", type: "text" },
  { label: "Email", placeholder: "john@example.com", type: "email" },
  { label: "Phone", placeholder: "+234 801 000 0000", type: "tel" },
];

export default function NewApplicationPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <Link href="/applications" className="text-sm text-[var(--muted)]">← Applications</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create mortgage application</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Start a new digital mortgage case. The case can be completed in stages after creation.</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <form className="space-y-6">
          <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold">Applicant</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Create or identify the primary customer for this case.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.label} className="space-y-1.5 text-sm">
                  <span className="font-medium text-slate-700">{field.label}</span>
                  <input type={field.type} placeholder={field.placeholder} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 outline-none focus:border-slate-500" />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold">Mortgage request</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Capture the initial commercial terms. Final terms remain subject to underwriting.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Mortgage product</span>
                <select className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5">
                  <option>Home Purchase</option>
                  <option>First Home</option>
                  <option>Affordable Housing</option>
                  <option>Home Improvement</option>
                </select>
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Requested amount (NGN)</span>
                <input type="number" min="0" placeholder="85000000" className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5" />
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Tenure</span>
                <select className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5">
                  <option>10 years</option>
                  <option>15 years</option>
                  <option>20 years</option>
                  <option>25 years</option>
                </select>
              </label>
              <label className="space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Purpose</span>
                <select className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5">
                  <option>Purchase existing property</option>
                  <option>Construction</option>
                  <option>Home improvement</option>
                  <option>Refinance</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Prototype notice:</strong> this form currently creates the interface only. Persistence, authentication and controlled submission will be wired to Supabase in the next implementation step.
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link href="/applications" className="rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium">Cancel</Link>
            <button type="button" className="rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white">Save draft</button>
          </div>
        </form>
      </div>
    </main>
  );
}
