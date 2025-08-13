import { query } from '@/lib/db/pg';
import type { BuilderDocument } from '@/lib/builder/types';

export type BuilderDocRow = {
  id: string;
  name: string;
  subject: string | null;
  blocks: any;
  version: number;
  created_at: string;
  updated_at: string;
};

export async function createBuilderDoc(name: string, doc: BuilderDocument) {
  const insert = await query<BuilderDocRow>(
    `insert into public.builder_docs (name, subject, blocks, version)
     values ($1, $2, $3, 1)
     returning *`,
    [name, doc.subject || null, JSON.stringify(doc.blocks)]
  );
  const row = insert.rows[0];
  await query(
    `insert into public.builder_doc_versions (doc_id, version, subject, blocks) values ($1, $2, $3, $4)`,
    [row.id, 1, row.subject, JSON.stringify(row.blocks)]
  );
  return row;
}

export async function updateBuilderDoc(id: string, doc: BuilderDocument) {
  const current = await query<BuilderDocRow>(`select * from public.builder_docs where id = $1`, [id]);
  if (!current.rows[0]) throw new Error('Not found');
  const nextVersion = (current.rows[0].version || 1) + 1;
  const updated = await query<BuilderDocRow>(
    `update public.builder_docs set subject = $2, blocks = $3, version = $4, updated_at = now() where id = $1 returning *`,
    [id, doc.subject || null, JSON.stringify(doc.blocks), nextVersion]
  );
  const row = updated.rows[0];
  await query(
    `insert into public.builder_doc_versions (doc_id, version, subject, blocks) values ($1, $2, $3, $4)`,
    [id, nextVersion, row.subject, JSON.stringify(row.blocks)]
  );
  return row;
}

export async function listBuilderDocs(): Promise<BuilderDocRow[]> {
  const res = await query<BuilderDocRow>(`select * from public.builder_docs order by updated_at desc`);
  return res.rows;
}

export async function getBuilderDoc(id: string): Promise<BuilderDocRow> {
  const res = await query<BuilderDocRow>(`select * from public.builder_docs where id = $1`, [id]);
  if (!res.rows[0]) throw new Error('Not found');
  return res.rows[0];
}
