import { EmailLayout } from '@/emails/kit/Layout';
import { EButton, EHeading, ESection, EText } from '@/emails/kit/Components';

export default function EmailKitPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold text-[#e6e6e6]">Email UI Kit</h1>
        <p className="text-[#a3a3a3]">Reusable layout, headings, text, sections, and neon buttons.</p>
        <div className="mt-4 rounded-lg border border-[#1f2937] bg-white p-4 text-black">
          {EmailLayout({
            preview: 'Edge Email Preview',
            children: (
              <>
                <EHeading>Welcome to Edge</EHeading>
                <EText>Build beautiful emails with a centralized style and tokens.</EText>
                <ESection>
                  <EText>Try our latest equipment lineup designed for performance.</EText>
                  <EButton href="https://edgefoodequipment.com">Shop now</EButton>
                </ESection>
              </>
            ),
          })}
        </div>
      </section>
    </main>
  );
}
