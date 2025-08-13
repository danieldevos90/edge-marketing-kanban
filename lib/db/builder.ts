import { supabaseAdmin } from '@/lib/supabase';
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
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('builder_docs')
    .insert({ name, subject: doc.subject || null, blocks: doc.blocks, version: 1 })
    .select('*')
    .single<BuilderDocRow>();
  if (error) throw error;
  await db.from('builder_doc_versions').insert({ doc_id: data.id, version: 1, subject: data.subject, blocks: data.blocks });
  return data;
}

export async function updateBuilderDoc(id: string, doc: BuilderDocument) {
  const db = supabaseAdmin();
  const { data: current, error: fetchErr } = await db.from('builder_docs').select('*').eq('id', id).single<BuilderDocRow>();
  if (fetchErr) throw fetchErr;
  const nextVersion = (current?.version || 1) + 1;
  const { data, error } = await db
    .from('builder_docs')
    .update({ subject: doc.subject || null, blocks: doc.blocks, version: nextVersion, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single<BuilderDocRow>();
  if (error) throw error;
  await db.from('builder_doc_versions').insert({ doc_id: id, version: nextVersion, subject: data.subject, blocks: data.blocks });
  return data;
}

export async function listBuilderDocs(): Promise<BuilderDocRow[]> {
  const db = supabaseAdmin();
  const { data, error } = await db.from('builder_docs').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data as BuilderDocRow[];
}

export async function getBuilderDoc(id: string): Promise<BuilderDocRow> {
  const db = supabaseAdmin();
  const { data, error } = await db.from('builder_docs').select('*').eq('id', id).single<BuilderDocRow>();
  if (error) throw error;
  return data as BuilderDocRow;
}
