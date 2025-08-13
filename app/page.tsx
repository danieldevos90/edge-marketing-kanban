import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            <span className="text-[#e6e6e6]">Edge Marketing </span>
            <span className="text-[#20f3ff]">Kanban</span>
          </h1>
          <div className="flex gap-2">
            <Link href="/campaigns" className="rounded-md bg-[#20f3ff] px-3 py-2 text-black hover:opacity-90">View Campaigns</Link>
            <Link href="/templates/builder" className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Email Builder</Link>
            <Link href="/templates/kit" className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Email Kit</Link>
          </div>
        </div>
        <p className="mt-3 text-[#a3a3a3] max-w-2xl">
          Centralized email creation, segmentation, and campaign orchestration across funnel phases: awareness, acquisition, conversion, care.
        </p>

        <div className="mt-10 flex items-center gap-3">
          <input
            placeholder="Search campaigns…"
            className="w-72 rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]"
          />
          <select className="rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]">
            <option>All phases</option>
            <option>Awareness</option>
            <option>Acquisition</option>
            <option>Conversion</option>
            <option>Care</option>
          </select>
          <select className="rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]">
            <option>All status</option>
            <option>Backlog</option>
            <option>Plan</option>
            <option>Build</option>
            <option>QA</option>
            <option>Approve</option>
            <option>Scheduled</option>
            <option>Sent</option>
            <option>Analyze</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {['Awareness', 'Acquisition', 'Conversion', 'Care'].map((phase) => (
            <div
              key={phase}
              className="rounded-lg border border-[#1f2937] bg-black/40 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-medium text-[#e6e6e6]">{phase}</h2>
              <p className="mt-1 text-sm text-[#a3a3a3]">No campaigns yet</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
