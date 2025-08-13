"use client";

import { useState } from 'react';

export type FiltersState = {
  query: string;
  from: string;
  dateFrom: string;
  dateTo: string;
};

export function Filters({ initial, onApply }: { initial?: Partial<FiltersState>; onApply: (f: FiltersState) => void }) {
  const [query, setQuery] = useState(initial?.query ?? "");
  const [from, setFrom] = useState(initial?.from ?? "");
  const [dateFrom, setDateFrom] = useState(initial?.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(initial?.dateTo ?? "");

  const clear = () => {
    setQuery("");
    setFrom("");
    setDateFrom("");
    setDateTo("");
    onApply({ query: "", from: "", dateFrom: "", dateTo: "" });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#1f2937] bg-black/40 p-3 md:flex-row md:items-end md:gap-4">
      <div className="flex-1">
        <label className="block text-sm text-[#a3a3a3]">Search subject</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subject..."
          className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#a3a3a3]">From</label>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Edge <marketing@...>"
          className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#a3a3a3]">Date from</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#a3a3a3]">Date to</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onApply({ query, from, dateFrom, dateTo })}
          className="rounded-md bg-[#20f3ff] px-3 py-2 text-black hover:opacity-90"
        >
          Apply
        </button>
        <button
          onClick={clear}
          className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
