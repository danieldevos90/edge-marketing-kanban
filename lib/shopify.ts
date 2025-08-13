const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-07';

export async function queryShopify<T = any>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN;
  if (!domain) throw new Error('Missing SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN');
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
  const res = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify GraphQL error: ${res.status} ${res.statusText} — ${text}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL returned errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}
