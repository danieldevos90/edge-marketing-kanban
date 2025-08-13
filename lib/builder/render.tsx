import { EmailLayout } from '@/emails/kit/Layout';
import { EButton, EHeading, ESection, EText } from '@/emails/kit/Components';
import type { BuilderDocument, BuilderBlock } from './types';

export function renderBlocks(blocks: BuilderBlock[]) {
  return (
    <>
      {blocks.map((b) => {
        if (b.type === 'banner') {
          return (
            <div key={b.id}>
              <img src={b.imageUrl} alt={b.title} style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
              <EHeading>{b.title}</EHeading>
            </div>
          );
        }
        if (b.type === 'productGrid') {
          return (
            <ESection key={b.id}>
              {b.products.length ? (
                <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {b.products.map((p) => (
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
          );
        }
        if (b.type === 'text') {
          return (
            <div key={b.id} dangerouslySetInnerHTML={{ __html: b.html }} />
          );
        }
        if (b.type === 'button') {
          return (
            <div key={b.id} style={{ marginTop: 12 }}>
              <EButton href={b.href}>{b.label}</EButton>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export function renderEmail(doc: BuilderDocument) {
  return EmailLayout({ preview: doc.subject || 'Edge Email', children: renderBlocks(doc.blocks) });
}
