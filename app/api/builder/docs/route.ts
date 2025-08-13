import { NextRequest, NextResponse } from 'next/server';
import { createBuilderDoc, listBuilderDocs } from '@/lib/db/builder';

export const dynamic = 'force-dynamic';

export async function GET() {
  const docs = await listBuilderDocs();
  return NextResponse.json({ docs });
}

export async function POST(req: NextRequest) {
  const { name, doc } = await req.json();
  if (!name || !doc) return NextResponse.json({ error: 'name and doc required' }, { status: 400 });
  const created = await createBuilderDoc(name, doc);
  return NextResponse.json({ doc: created });
}
