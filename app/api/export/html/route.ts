import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import type { BuilderDocument } from '@/lib/builder/types';
import { renderEmail } from '@/lib/builder/render';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const doc = (await req.json()) as BuilderDocument;
  const reactNode = renderEmail(doc);
  const html = render(reactNode);
  return NextResponse.json({ html });
}
