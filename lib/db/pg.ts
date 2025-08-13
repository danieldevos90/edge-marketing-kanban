import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    let ssl: any = false;
    try {
      const host = new URL(connectionString).hostname || '';
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
      ssl = isLocal ? false : { rejectUnauthorized: false };
    } catch {
      ssl = { rejectUnauthorized: false };
    }
    pool = new Pool({ connectionString, max: 5, ssl });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const p = getPool();
  const res = await p.query(text, params);
  return { rows: res.rows as T[] };
}
