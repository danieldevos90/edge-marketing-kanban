"use client";

import { useCallback, useMemo, useState } from 'react';
import { ProductPicker, Product } from '@/app/components/ProductPicker';
import { renderEmail } from '@/lib/builder/render';
import type { BannerBlock, BuilderBlock, BuilderDocument, ButtonBlock, ProductGridBlock, TextBlock } from '@/lib/builder/types';

function uid() { return Math.random().toString(36).slice(2, 9); }

export default function EmailBuilderPage() {
  const [subject, setSubject] = useState('Edge — Featured Picks');
  const [blocks, setBlocks] = useState<BuilderBlock[]>([
    { id: uid(), type: 'banner', title: 'Edge — Featured Picks', imageUrl: 'https://edgefoodequipment.com/img/64414d328b6aadbba30297341828df438299a7db.jpg', ctaLabel: 'Shop now', ctaHref: 'https://edgefoodequipment.com' } as BannerBlock,
    { id: uid(), type: 'productGrid', products: [] } as ProductGridBlock,
    { id: uid(), type: 'button', label: 'Shop now', href: 'https://edgefoodequipment.com' } as ButtonBlock,
  ]);

  const addBlock = (type: BuilderBlock['type']) => {
    if (type === 'banner') setBlocks((b) => [...b, { id: uid(), type, title: 'New Banner', imageUrl: '', ctaLabel: 'Learn more', ctaHref: '#' } as BannerBlock]);
    if (type === 'productGrid') setBlocks((b) => [...b, { id: uid(), type, products: [] } as ProductGridBlock]);
    if (type === 'text') setBlocks((b) => [...b, { id: uid(), type, html: '<p>Write your copy…</p>' } as TextBlock]);
    if (type === 'button') setBlocks((b) => [...b, { id: uid(), type, label: 'Call to action', href: '#' } as ButtonBlock]);
  };

  const move = (index: number, dir: -1 | 1) => {
    setBlocks((b) => {
      const next = [...b];
      const target = index + dir;
      if (target < 0 || target >= next.length) return next;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const remove = (index: number) => setBlocks((b) => b.filter((_, i) => i !== index));

  const update = useCallback((index: number, patch: Partial<BuilderBlock>) => {
    setBlocks((b) => b.map((blk, i) => (i === index ? ({ ...blk, ...patch } as BuilderBlock) : blk)));
  }, []);

  const onProductsChange = (index: number) => (items: Product[]) => {
    const products = items.map((p) => ({ id: p.id, title: p.title, imageUrl: p.imageUrl, price: p.price }));
    update(index, { products } as Partial<ProductGridBlock> as any);
  };

  const doc: BuilderDocument = useMemo(() => ({ subject, blocks }), [subject, blocks]);
  const preview = useMemo(() => renderEmail(doc), [doc]);

  const exportHtml = async () => {
    const res = await fetch('/api/export/html', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
    const { html } = await res.json();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'email.html'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-[#e6e6e6]">Email Builder</h1>

          <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4 space-y-3">
            <div>
              <label className="block text-sm text-[#a3a3a3]">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
            </div>
          </div>

          <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => addBlock('banner')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Banner</button>
              <button onClick={() => addBlock('productGrid')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Product Grid</button>
              <button onClick={() => addBlock('text')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Text</button>
              <button onClick={() => addBlock('button')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Button</button>
            </div>

            <div className="space-y-3">
              {blocks.map((blk, i) => (
                <div key={blk.id} className="rounded-md border border-[#1f2937] bg-black/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-[#a3a3a3]">{blk.type}</div>
                    <div className="flex gap-2">
                      <button onClick={() => move(i, -1)} className="rounded-md border border-[#1f2937] px-2 py-1 text-[#e6e6e6] hover:border-[#20f3ff]">↑</button>
                      <button onClick={() => move(i, 1)} className="rounded-md border border-[#1f2937] px-2 py-1 text-[#e6e6e6] hover:border-[#20f3ff]">↓</button>
                      <button onClick={() => remove(i)} className="rounded-md border border-[#1f2937] px-2 py-1 text-[#ff3b5c] hover:border-[#ff3b5c]">✕</button>
                    </div>
                  </div>

                  {blk.type === 'banner' && (
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm text-[#a3a3a3]">Title</label>
                        <input value={(blk as any).title} onChange={(e) => update(i, { title: e.target.value } as any)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a3a3a3]">Image URL</label>
                        <input value={(blk as any).imageUrl} onChange={(e) => update(i, { imageUrl: e.target.value } as any)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-[#a3a3a3]">CTA Label</label>
                          <input value={(blk as any).ctaLabel} onChange={(e) => update(i, { ctaLabel: e.target.value } as any)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                        </div>
                        <div>
                          <label className="block text-sm text-[#a3a3a3]">CTA Link</label>
                          <input value={(blk as any).ctaHref} onChange={(e) => update(i, { ctaHref: e.target.value } as any)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {blk.type === 'productGrid' && (
                    <ProductPicker onChange={onProductsChange(i)} />
                  )}

                  {blk.type === 'text' && (
                    <div>
                      <label className="block text-sm text-[#a3a3a3]">HTML</label>
                      <textarea value={(blk as any).html} onChange={(e) => update(i, { html: e.target.value } as any)} className="mt-1 h-32 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                    </div>
                  )}

                  {blk.type === 'button' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-[#a3a3a3]">Label</label>
                        <input value={(blk as any).label} onChange={(e) => update(i, { label: e.target.value } as any)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#a3a3a3]">Link</label>
                        <input value={(blk as any).href} onChange={(e) => update(i, { href: e.target.value } as any)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={exportHtml} className="rounded-md bg-[#20f3ff] px-3 py-2 text-black hover:opacity-90">Export HTML</button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4">
          <div className="mb-2 text-sm text-[#a3a3a3]">Live preview</div>
          <div className="rounded-md border border-[#1f2937] bg-white p-4 text-black">{preview}</div>
        </div>
      </section>
    </main>
  );
}
