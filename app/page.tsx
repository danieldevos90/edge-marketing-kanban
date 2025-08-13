export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          <span className="text-[#e6e6e6]">Edge Marketing </span>
          <span className="text-[#20f3ff]">Kanban</span>
        </h1>
        <p className="mt-3 text-[#a3a3a3] max-w-2xl">
          Centralized email creation, segmentation, and campaign orchestration across funnel phases: awareness, acquisition, conversion, care.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
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
