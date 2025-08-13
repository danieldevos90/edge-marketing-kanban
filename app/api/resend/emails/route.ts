import { NextRequest, NextResponse } from 'next/server';
import { listResendEmails } from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');
  const from = searchParams.get('from') || undefined;
  const subject = searchParams.get('subject') || undefined;
  const dateFrom = searchParams.get('dateFrom') || undefined;
  const dateTo = searchParams.get('dateTo') || undefined;

  const emails = await listResendEmails({
    limit: limit ? parseInt(limit, 10) : 50,
    from,
    subject,
    dateFrom,
    dateTo,
  });

  return NextResponse.json({ emails });
}
