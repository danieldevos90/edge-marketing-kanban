import { NextRequest, NextResponse } from 'next/server';
import { getResend } from '@/lib/resend';
import Announcement from '@/emails/Announcement';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { to, subject = 'Edge Announcement', html } = await req.json();
  if (!Array.isArray(to)) {
    return NextResponse.json({ error: 'to must be array' }, { status: 400 });
  }
  const resend = getResend();
  if (typeof html === 'string' && html.length > 0) {
    const result = await resend.emails.send({ from: 'Edge <marketing@edgefoodequipment.com>', to, subject, html });
    return NextResponse.json({ ok: true, result });
  }
  const result = await resend.emails.send({
    from: 'Edge <marketing@edgefoodequipment.com>',
    to,
    subject,
    react: Announcement(),
  });
  return NextResponse.json({ ok: true, result });
}
