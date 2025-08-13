import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    pool = new Pool({ connectionString, max: 5, ssl: { rejectUnauthorized: false } as any });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const p = getPool();
  const res = await p.query(text, params);
  return { rows: res.rows as T[] };
}
