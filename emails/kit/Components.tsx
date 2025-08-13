export function EHeading({ children }: { children: React.ReactNode }) {
  return <h2 style={{ color: '#e6e6e6', margin: '0 0 8px', fontWeight: 600 }}>{children}</h2>;
}

export function EText({ children }: { children: React.ReactNode }) {
  return <p style={{ color: '#a3a3a3', margin: '8px 0' }}>{children}</p>;
}

export function ESection({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#0f0f0f', border: '1px solid #1f2937', borderRadius: 8, padding: 16 }}>{children}</div>;
}

export function EButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        background: '#20f3ff',
        color: '#000',
        padding: '10px 14px',
        borderRadius: 8,
        textDecoration: 'none',
        fontWeight: 600,
      }}
    >
      {children}
    </a>
  );
}
