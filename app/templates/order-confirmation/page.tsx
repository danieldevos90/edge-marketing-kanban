"use client";

import { useMemo, useState } from 'react';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

export default function OrderConfirmationEditor() {
  const [to, setTo] = useState('you@example.com');
  const [sageOrderNumber, setSageOrderNumber] = useState('SAGE-12345');
  const [customerName, setCustomerName] = useState('Alex Johnson');
  const [currency, setCurrency] = useState('CAD');

  const [items, setItems] = useState([
    { name: 'Commercial Blender', sku: 'BLND-100', quantity: 1, price: 249.0 },
    { name: 'Stainless Steel Worktable', sku: 'WT-48x24', quantity: 2, price: 189.99 },
  ]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const totalTax = useMemo(() => Math.round(subtotal * 0.13 * 100) / 100, [subtotal]);
  const totalPrice = useMemo(() => subtotal + totalTax, [subtotal, totalTax]);

  const order = useMemo(() => ({
    name: '#123456',
    billing_address: {
      first_name: customerName.split(' ')[0] || 'Alex',
      last_name: customerName.split(' ').slice(1).join(' ') || 'Johnson',
      address1: '123 King St W',
      address2: 'Suite 500',
      city: 'Toronto',
      province_code: 'ON',
      zip: 'M5H 1A1',
      country: 'Canada'
    },
    shipping_address: undefined,
    line_items: items,
    subtotal_price: subtotal,
    total_tax: totalTax,
    total_price: totalPrice,
    currency,
  }), [customerName, items, subtotal, totalTax, totalPrice, currency]);

  const send = async () => {
    const res = await fetch('/api/send/order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: to.split(',').map((s) => s.trim()), order, sageOrderNumber }),
    });
    const json = await res.json();
    alert(res.ok ? 'Sent!' : `Failed: ${json.error || 'unknown error'}`);
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-[#e6e6e6]">Order Confirmation Template</h1>
          <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4">
            <label className="block text-sm text-[#a3a3a3]">Recipients (comma-separated)</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#a3a3a3]">Sage Order</label>
                <input value={sageOrderNumber} onChange={(e) => setSageOrderNumber(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
              </div>
              <div>
                <label className="block text-sm text-[#a3a3a3]">Customer Name</label>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm text-[#a3a3a3]">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 w-full rounded-md border border-[#1f2937] bg-[#0a0a0a] p-2 text-[#e6e6e6]">
                <option>CAD</option>
                <option>USD</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={send} className="rounded-md bg-[#20f3ff] px-3 py-2 text-black hover:opacity-90">Send Test</button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[#1f2937] bg-black/40 p-4">
          <div className="mb-2 text-sm text-[#a3a3a3]">Live preview</div>
          <div className="rounded-md border border-[#1f2937] bg-white p-4 text-black">
            {/* Render preview via component */}
            {OrderConfirmationEmail({
              orderNumber: (order.name || '').replace('#', ''),
              sageOrderNumber,
              customerName,
              billingAddressHtml: '',
              shippingAddressHtml: `${order.billing_address.first_name} ${order.billing_address.last_name}<br>${order.billing_address.address1}<br>${order.billing_address.address2}<br>${order.billing_address.city}, ${order.billing_address.province_code} ${order.billing_address.zip}<br>${order.billing_address.country}`,
              items: items as any,
              subtotal,
              totalTax,
              totalPrice,
              currency,
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
