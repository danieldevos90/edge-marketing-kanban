"use client";

import { useEffect, useMemo, useState } from 'react';

export type Product = { id: string; title: string; handle: string; imageUrl?: string | null; price?: number };

export function ProductPicker({ onChange, initialSelected = [] }: { onChange: (products: Product[]) => void; initialSelected?: Product[] }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product[]>(initialSelected);

  const fetchProducts = async (q: string) => {
    setLoading(true); setError(null);
    try {
      const sp = new URLSearchParams();
      if (q) sp.set('q', q);
      const res = await fetch(`/api/shopify/products?${sp.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();
      setResults(json.products || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(''); }, []);

  useEffect(() => { onChange(selected); }, [selected, onChange]);

  const toggle = (p: Product) => {
    setSelected((prev) => prev.some((x) => x.id === p.id) ? prev.filter((x) => x.id !== p.id) : [...prev, p]);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchProducts(query)}
          placeholder="Search products…"
          className="w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6] outline-none focus:border-[#20f3ff]"
        />
        <button onClick={() => fetchProducts(query)} className="rounded-md bg-[#20f3ff] px-3 py-2 text-black hover:opacity-90">Search</button>
      </div>
      {error && <div className="text-[#ff3b5c]">{error}</div>}
      {loading && <div className="text-[#a3a3a3]">Loading…</div>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {results.map((p) => {
          const isSelected = selected.some((s) => s.id === p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p)}
              className={`text-left rounded-lg border p-3 transition-colors ${isSelected ? 'border-[#20f3ff] bg-black/60' : 'border-[#1f2937] bg-black/40 hover:border-[#20f3ff]'}`}
            >
              <div className="aspect-square overflow-hidden rounded-md bg-[#111]">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#a3a3a3]">No image</div>
                )}
              </div>
              <div className="mt-2 text-sm text-[#e6e6e6] line-clamp-2">{p.title}</div>
              {typeof p.price === 'number' && <div className="text-xs text-[#a3a3a3]">${p.price.toFixed(2)}</div>}
            </button>
          );
        })}
      </div>
      {!!selected.length && (
        <div className="rounded-md border border-[#1f2937] bg-black/40 p-3 text-[#a3a3a3]">
          Selected: {selected.map((p) => p.title).join(', ')}
        </div>
      )}
    </div>
  );
}
