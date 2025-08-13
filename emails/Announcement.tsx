import {
  Html, Head, Preview, Heading, Text, Link, Section
} from '@react-email/components';

export default function Announcement() {
  return (
    <Html>
      <Head>
        <title>Edge — New Product</title>
        <style>{`:root{--accent:#20f3ff} body{background:#0a0a0a;color:#e6e6e6;font-family:Inter,Arial}`}</style>
      </Head>
      <Preview>Announcing our latest product</Preview>
      <Section>
        <Heading style={{ color: 'var(--accent)' }}>Introducing...</Heading>
        <Text>Details about the product go here.</Text>
        <Link href="https://edgefoodequipment.com" style={{ color: 'var(--accent)' }}>Shop now</Link>
      </Section>
    </Html>
  );
}
