"use client";

import { useEffect, useMemo, useState } from 'react';
import { Filters, FiltersState } from '@/app/components/Filters';
import { CampaignList, CampaignEmail } from '@/app/components/CampaignList';

async function fetchEmails(params: Partial<FiltersState> & { limit?: number; status?: string }) {
  const sp = new URLSearchParams();
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.from) sp.set('from', params.from);
  if (params.query) sp.set('subject', params.query);
  if (params.dateFrom) sp.set('dateFrom', params.dateFrom);
  if (params.dateTo) sp.set('dateTo', params.dateTo);
  if (params.status) sp.set('status', params.status);
  const res = await fetch(`/api/resend/emails?${sp.toString() || ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load emails');
  const json = await res.json();
  return json.emails as CampaignEmail[];
}

export default function CampaignsPage() {
  const [filters, setFilters] = useState<FiltersState>({ query: '', from: '', dateFrom: '', dateTo: '' });
  const [status, setStatus] = useState<string>('');
  const [emails, setEmails] = useState<CampaignEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applied = useMemo(() => ({ ...filters, status }), [filters, status]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEmails({ ...applied, limit: 50 })
      .then((items) => {
        if (!cancelled) setEmails(items);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [applied.query, applied.from, applied.dateFrom, applied.dateTo, applied.status]);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#e6e6e6]">Campaigns</h1>
        </div>
        <p className="mt-2 text-[#a3a3a3]">Browse previously sent emails from Resend. Filter by subject, sender, date range, and status.</p>

        <div className="mt-6 space-y-3">
          <Filters onApply={setFilters} />
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-sm text-[#a3a3a3]">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]">
                <option value="">All</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="opened">Opened</option>
                <option value="clicked">Clicked</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading && <div className="text-[#a3a3a3]">Loading…</div>}
          {error && <div className="text-[#ff3b5c]">{error}</div>}
          {!loading && !error && <CampaignList emails={emails} />}
        </div>
      </section>
    </main>
  );
}
