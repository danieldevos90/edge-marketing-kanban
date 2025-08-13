import { NextRequest, NextResponse } from 'next/server';
import { getResend } from '@/lib/resend';
import OrderConfirmationEmail, { OrderItem } from '@/emails/OrderConfirmation';
import { formatAddress } from '@/lib/email/format';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { to, from = 'Edge <orders@edgefoodequipment.com>', order, sageOrderNumber } = payload || {};
  if (!Array.isArray(to)) return NextResponse.json({ error: 'to must be array' }, { status: 400 });
  if (!order) return NextResponse.json({ error: 'missing order' }, { status: 400 });

  const orderNumber: string = String(order.name || '').replace('#', '');
  const billing = order.billing_address || {};
  const shipping = order.shipping_address || billing;
  const customerName = `${billing.first_name || ''} ${billing.last_name || ''}`.trim() || order.customer?.email || 'Valued Customer';

  const items: OrderItem[] = (order.line_items || []).map((it: any) => ({
    name: it.name || it.title || 'Unknown Product',
    sku: it.sku || undefined,
    quantity: Number(it.quantity || 1),
    price: Number(it.price || 0),
  }));

  const subtotal = Number(order.subtotal_price || 0);
  const totalTax = Number(order.total_tax || 0);
  const totalPrice = Number(order.total_price || 0);
  const currency = order.currency || 'CAD';

  const reactEmail = OrderConfirmationEmail({
    orderNumber,
    sageOrderNumber,
    customerName,
    billingAddressHtml: formatAddress(billing),
    shippingAddressHtml: formatAddress(shipping),
    items,
    subtotal,
    totalTax,
    totalPrice,
    currency,
  });

  const resend = getResend();
  const result = await resend.emails.send({
    from,
    to,
    subject: `Order Confirmation — #${orderNumber}`,
    react: reactEmail,
  });

  return NextResponse.json({ ok: true, result });
}
