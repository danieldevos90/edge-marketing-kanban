"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProductPicker, Product } from '@/app/components/ProductPicker';
import type { BannerBlock, BuilderBlock, BuilderDocument, ButtonBlock, ProductGridBlock, TextBlock } from '@/lib/builder/types';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function uid() { return Math.random().toString(36).slice(2, 9); }

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function EmailBuilderPage() {
  const [subject, setSubject] = useState('Edge — Featured Picks');
  const [blocks, setBlocks] = useState<BuilderBlock[]>([
    { id: uid(), type: 'banner', title: 'Edge — Featured Picks', imageUrl: 'https://edgefoodequipment.com/img/64414d328b6aadbba30297341828df438299a7db.jpg', ctaLabel: 'Shop now', ctaHref: 'https://edgefoodequipment.com' } as BannerBlock,
    { id: uid(), type: 'productGrid', products: [] } as ProductGridBlock,
    { id: uid(), type: 'button', label: 'Shop now', href: 'https://edgefoodequipment.com' } as ButtonBlock,
  ]);
  const [docId, setDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string>('Featured Picks');

  const addBlock = (type: BuilderBlock['type']) => {
    if (type === 'banner') setBlocks((b) => [...b, { id: uid(), type, title: 'New Banner', imageUrl: '', ctaLabel: 'Learn more', ctaHref: '#' } as BannerBlock]);
    if (type === 'productGrid') setBlocks((b) => [...b, { id: uid(), type, products: [] } as ProductGridBlock]);
    if (type === 'text') setBlocks((b) => [...b, { id: uid(), type, html: '<p>Write your copy…</p>' } as TextBlock]);
    if (type === 'button') setBlocks((b) => [...b, { id: uid(), type, label: 'Call to action', href: '#' } as ButtonBlock]);
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

  // Debounced export to HTML for iframe preview
  const [previewHtml, setPreviewHtml] = useState('');
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingHtml(true);
      setPreviewError(null);
      try {
        const res = await fetch('/api/export/html', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { html } = await res.json();
        setPreviewHtml(typeof html === 'string' ? html : '');
      } catch (e: any) {
        setPreviewHtml('');
        setPreviewError(e?.message || 'Failed to render');
      } finally {
        setLoadingHtml(false);
      }
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [doc]);

  const exportHtml = async () => {
    const res = await fetch('/api/export/html', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
    const { html } = await res.json();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'email.html'; a.click();
    URL.revokeObjectURL(url);
  };

  const saveDoc = async () => {
    const body = { name: docName, doc };
    if (!docId) {
      const res = await fetch('/api/builder/docs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      if (res.ok) setDocId(json.doc.id);
      alert(res.ok ? 'Saved!' : json.error || 'Failed');
    } else {
      const res = await fetch(`/api/builder/docs/${docId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ doc }) });
      const json = await res.json();
      alert(res.ok ? 'Updated!' : json.error || 'Failed');
    }
  };

  const sendHtml = async () => {
    const to = prompt('Recipients (comma-separated)') || '';
    if (!to) return;
    const resHtml = await fetch('/api/export/html', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) });
    const { html } = await resHtml.json();
    const res = await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: to.split(',').map((s) => s.trim()), subject, html }) });
    const json = await res.json();
    alert(res.ok ? 'Sent!' : json.error || 'Failed to send');
  };

  const fallbackHtml = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#0a0a0a;color:#e6e6e6;font-family:Inter,Arial;margin:0;padding:16px}</style></head><body><div>Rendering preview…</div></body></html>';

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    setBlocks((b) => arrayMove(b, oldIndex, newIndex));
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-4 text-2xl font-semibold text-[#e6e6e6]">Email Builder</h1>
        <div className="flex gap-6">
          <div className="w-[380px] shrink-0">
            <div className="space-y-4">
              <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4 space-y-3">
                <div>
                  <label className="block text-sm text-[#a3a3a3]">Document name</label>
                  <input value={docName} onChange={(e) => setDocName(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                </div>
                <div>
                  <label className="block text-sm text-[#a3a3a3]">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveDoc} className="rounded-md bg-[#20f3ff] px-3 py-2 text-black hover:opacity-90">{docId ? 'Update' : 'Save'}</button>
                  <button onClick={exportHtml} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Export HTML</button>
                  <button onClick={sendHtml} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Send</button>
                </div>
              </div>

              <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => addBlock('banner')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Banner</button>
                  <button onClick={() => addBlock('productGrid')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Product Grid</button>
                  <button onClick={() => addBlock('text')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Text</button>
                  <button onClick={() => addBlock('button')} className="rounded-md border border-[#1f2937] px-3 py-2 text-[#e6e6e6] hover:border-[#20f3ff]">Add Button</button>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {blocks.map((blk, i) => (
                        <SortableItem key={blk.id} id={blk.id}>
                          <div className="rounded-md border border-[#1f2937] bg-black/40 p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="text-sm text-[#a3a3a3]">{blk.type}</div>
                              <div className="flex gap-2">
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
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="sticky top-6 rounded-lg border border-[#1f2937] bg-black/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm text-[#a3a3a3]">Live preview</div>
                {loadingHtml && <div className="text-xs text-[#a3a3a3]">Rendering…</div>}
              </div>
              {!!previewError && <div className="mb-2 text-xs text-[#ff3b5c]">{previewError}</div>}
              <div className="rounded-md border border-[#1f2937] bg-[#0a0a0a] text-[#e6e6e6]">
                <iframe title="preview" className="h-[80vh] w-full rounded-md" style={{ backgroundColor: '#0a0a0a' }} srcDoc={previewHtml || fallbackHtml} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
