import { Resend } from 'resend';

let client: Resend | null = null;

export function getResend(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY is not set');
  }
  client = new Resend(key);
  return client;
}

async function resendApiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API ${path} failed: ${res.status} ${res.statusText} — ${text}`);
  }
  return res.json() as Promise<T>;
}

export type ResendEmailItem = {
  id: string;
  to: string[] | string;
  from: string;
  subject?: string;
  created_at?: string;
  status?: string;
  [key: string]: unknown;
};

export async function listResendEmails(options: { limit?: number; from?: string; subject?: string; dateFrom?: string; dateTo?: string; status?: string } = {}): Promise<ResendEmailItem[]> {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', String(options.limit));
  if (options.from) params.set('from', options.from);
  if (options.subject) params.set('subject', options.subject);
  if (options.dateFrom) params.set('date_from', options.dateFrom);
  if (options.dateTo) params.set('date_to', options.dateTo);
  if (options.status) params.set('status', options.status);

  try {
    const data = await resendApiFetch<{ data?: ResendEmailItem[]; emails?: ResendEmailItem[] }>(`/emails${params.toString() ? `?${params.toString()}` : ''}`);
    const list = (data as any).data || (data as any).emails || [];
    return Array.isArray(list) ? list : [];
  } catch (_err) {
    return [];
  }
}
