import { NextRequest, NextResponse } from 'next/server';
import { queryShopify } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const q = searchParams.get('q') || undefined;
	const limit = parseInt(searchParams.get('limit') || '20', 10);

	const query = `#graphql
		query Products($first: Int!, $query: String) {
			products(first: $first, query: $query) {
				edges {
					node {
						id
						title
						handle
						featuredImage { url altText }
						variants(first: 1) { edges { node { price } } }
					}
				}
			}
		}
	`;

	const data = await queryShopify<any>(query, { first: limit, query: q });
	const edges = data?.products?.edges || [];
	const products = edges.map((e: any) => {
		const v = e?.node?.variants?.edges?.[0]?.node;
		const rawPrice = v?.price;
		const price = typeof rawPrice === 'object' && rawPrice?.amount ? Number(rawPrice.amount) : Number(rawPrice || 0);
		return {
			id: e?.node?.id,
			title: e?.node?.title,
			handle: e?.node?.handle,
			imageUrl: e?.node?.featuredImage?.url || null,
			imageAlt: e?.node?.featuredImage?.altText || null,
			price,
		};
	});

	return NextResponse.json({ products });
}
