import { NextRequest, NextResponse } from 'next/server';
import { getBuilderDoc, updateBuilderDoc } from '@/lib/db/builder';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const doc = await getBuilderDoc(params.id);
  return NextResponse.json({ doc });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateBuilderDoc(params.id, body.doc);
  return NextResponse.json({ doc: updated });
}
