import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

function verifyShopify(req: NextRequest, rawBody: string): boolean {
  const hmac = req.headers.get('x-shopify-hmac-sha256') || '';
  const digest = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET || '')
    .update(rawBody, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyShopify(req, raw)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const json = JSON.parse(raw);
    console.log('Shopify webhook', json?.id || json?.admin_graphql_api_id);
  } catch (e) {
    console.error('Invalid webhook body', e);
  }
  return NextResponse.json({ ok: true });
}
