import { Html, Head, Preview, Section } from '@react-email/components';

export function EmailLayout({ preview, children }: { preview?: string; children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <title>{preview || 'Edge Email'}</title>
        <style>{`body{background:#0a0a0a;color:#e6e6e6;font-family:Inter,Arial}`}</style>
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Section style={{ backgroundColor: '#000', textAlign: 'center', padding: '24px' }}>
        <img src="https://edgefoodequipment.com/img/Edge_logo_white.png" alt="Edge Food Equipment" height="42" />
      </Section>
      <Section style={{ padding: 24 }}>{children}</Section>
      <Section style={{ background: '#141414', color: '#fff', padding: 24, textAlign: 'center' }}>
        <div style={{ margin: 0 }}>Edge Food Equipment</div>
        <div style={{ margin: 0, opacity: 0.8, fontSize: 12 }}>Commercial kitchen equipment</div>
      </Section>
    </Html>
  );
}
