import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-resend-signature') || '';
  if (!process.env.RESEND_WEBHOOK_SECRET) return NextResponse.json({ ok: false }, { status: 401 });
  // TODO: verify signature once enabled; for now, accept if secret exists (placeholder)
  try {
    const json = await req.json();
    console.log('Resend webhook', json?.type, json?.data?.email?.to);
  } catch (e) {
    console.error('Invalid webhook body', e);
  }
  return NextResponse.json({ ok: true });
}
