"use client";

import { useMemo, useState } from 'react';
import { ProductPicker, Product } from '@/app/components/ProductPicker';
import { EmailLayout } from '@/emails/kit/Layout';
import { EButton, EHeading, ESection, EText } from '@/emails/kit/Components';

export default function EmailBuilderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bannerTitle, setBannerTitle] = useState('Edge — Featured Picks');
  const [bannerImage, setBannerImage] = useState('https://edgefoodequipment.com/img/64414d328b6aadbba30297341828df438299a7db.jpg');
  const [ctaHref, setCtaHref] = useState('https://edgefoodequipment.com');

  const preview = useMemo(() => (
    EmailLayout({
      preview: bannerTitle,
      children: (
        <>
          <img src={bannerImage} alt="Banner" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
          <EHeading>{bannerTitle}</EHeading>
          <EText>Handpicked products for performance and reliability.</EText>
          <ESection>
            {products.length ? (
              <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td style={{ padding: '8px 0' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ width: 64, height: 64, background: '#111', borderRadius: 8, overflow: 'hidden' }}>
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                          </div>
                          <div>
                            <div style={{ color: '#e6e6e6', fontWeight: 600 }}>{p.title}</div>
                            {typeof p.price === 'number' && <div style={{ color: '#a3a3a3', fontSize: 12 }}>${p.price?.toFixed(2)}</div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EText>No products selected yet.</EText>
            )}
          </ESection>
          <div style={{ marginTop: 12 }}>
            <EButton href={ctaHref}>Shop now</EButton>
          </div>
        </>
      ),
    })
  ), [bannerTitle, bannerImage, ctaHref, products]);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-[#e6e6e6]">Email Builder</h1>
          <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4 space-y-3">
            <div>
              <label className="block text-sm text-[#a3a3a3]">Banner title</label>
              <input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
            </div>
            <div>
              <label className="block text-sm text-[#a3a3a3]">Banner image URL</label>
              <input value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
            </div>
            <div>
              <label className="block text-sm text-[#a3a3a3]">CTA link</label>
              <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
            </div>
          </div>
          <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4">
            <h2 className="text-lg text-[#e6e6e6]">Products</h2>
            <ProductPicker onChange={setProducts} />
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
