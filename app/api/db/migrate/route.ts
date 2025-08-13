import { NextResponse } from 'next/server';
import { query } from '@/lib/db/pg';

export const dynamic = 'force-dynamic';

const SQL = `
create extension if not exists pgcrypto;

create table if not exists public.builder_docs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  blocks jsonb not null,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.builder_doc_versions (
  id bigserial primary key,
  doc_id uuid not null references public.builder_docs(id) on delete cascade,
  version int not null,
  subject text,
  blocks jsonb not null,
  created_at timestamptz not null default now()
);
`;

export async function POST() {
  const statements = SQL.split('\n\n').map((s) => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await query(stmt);
  }
  return NextResponse.json({ ok: true });
}
