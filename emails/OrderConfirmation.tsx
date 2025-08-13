import { Html, Head, Preview, Heading, Text, Section } from '@react-email/components';
import { formatAddress, formatCurrency } from '@/lib/email/format';

export type OrderItem = {
  name: string;
  sku?: string;
  quantity: number;
  price: number;
};

export type OrderConfirmationProps = {
  orderNumber: string;
  sageOrderNumber: string;
  customerName: string;
  billingAddressHtml: string;
  shippingAddressHtml: string;
  items: OrderItem[];
  subtotal: number;
  totalTax: number;
  totalPrice: number;
  currency: string;
};

export default function OrderConfirmationEmail(props: OrderConfirmationProps) {
  const { orderNumber, sageOrderNumber, customerName, shippingAddressHtml, items, subtotal, totalTax, totalPrice, currency } = props;

  return (
    <Html>
      <Head>
        <title>Order Confirmation - #{orderNumber}</title>
        <style>{`body{background:#0a0a0a;color:#e6e6e6;font-family:Inter,Arial}`}</style>
      </Head>
      <Preview>Order Confirmation — #{orderNumber}</Preview>

      {/* Header */}
      <Section style={{ backgroundColor: '#000', textAlign: 'center', padding: '24px' }}>
        <img src="https://edgefoodequipment.com/img/Edge_logo_white.png" alt="Edge Food Equipment" height="42" />
      </Section>

      {/* Greeting */}
      <Section style={{ padding: '24px 24px 0 24px' }}>
        <Heading as="h2" style={{ color: '#e6e6e6', margin: 0 }}>Hi {customerName},</Heading>
        <Text style={{ color: '#a3a3a3', marginTop: 8 }}>Your order has been received and is being processed.</Text>
      </Section>

      {/* Summary */}
      <Section style={{ padding: 24 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse', border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' }}>
          <tbody>
            <tr style={{ backgroundColor: '#0f0f0f' }}>
              <td style={{ padding: 16, borderBottom: '1px solid #1f2937', color: '#e6e6e6', fontWeight: 600 }}>Order Summary</td>
            </tr>
            <tr>
              <td style={{ padding: 16, borderBottom: '1px solid #1f2937' }}>
                <table width="100%">
                  <tbody>
                    <tr>
                      <td style={{ color: '#a3a3a3', fontSize: 12 }}>Order Number</td>
                      <td style={{ color: '#e6e6e6', fontWeight: 600, textAlign: 'right' }}>#{orderNumber}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#a3a3a3', fontSize: 12 }}>Sage 300 Order</td>
                      <td style={{ color: '#e6e6e6', fontWeight: 600, textAlign: 'right' }}>{sageOrderNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0f0f0f' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: '#a3a3a3', fontSize: 12, textTransform: 'uppercase' }}>Item</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', color: '#a3a3a3', fontSize: 12, textTransform: 'uppercase' }}>Qty</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', color: '#a3a3a3', fontSize: 12, textTransform: 'uppercase' }}>Price</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', color: '#a3a3a3', fontSize: 12, textTransform: 'uppercase' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #1f2937' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ color: '#e6e6e6', fontWeight: 600 }}>{item.name}</div>
                          {item.sku && <div style={{ color: '#a3a3a3', fontSize: 12 }}>SKU: {item.sku}</div>}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', color: '#e6e6e6' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#e6e6e6' }}>{formatCurrency(item.price, currency)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#e6e6e6', fontWeight: 700 }}>{formatCurrency(item.price * item.quantity, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 16, background: '#0f0f0f' }}>
                <table width="100%">
                  <tbody>
                    <tr>
                      <td style={{ color: '#e6e6e6' }}>Subtotal</td>
                      <td style={{ color: '#e6e6e6', textAlign: 'right' }}>{formatCurrency(subtotal, currency)}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#e6e6e6' }}>Tax</td>
                      <td style={{ color: '#e6e6e6', textAlign: 'right' }}>{formatCurrency(totalTax, currency)}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#e6e6e6', paddingTop: 8, borderTop: '1px solid #1f2937' }}>Total</td>
                      <td style={{ color: '#e6e6e6', textAlign: 'right', paddingTop: 8, borderTop: '1px solid #1f2937', fontWeight: 700 }}>{formatCurrency(totalPrice, currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Shipping Address */}
      <Section style={{ padding: '0 24px 24px' }}>
        <Heading as="h3" style={{ color: '#e6e6e6', margin: 0, fontSize: 16 }}>Shipping Address</Heading>
        <div style={{ color: '#e6e6e6', marginTop: 8 }} dangerouslySetInnerHTML={{ __html: shippingAddressHtml }} />
      </Section>

      {/* Footer */}
      <Section style={{ background: '#141414', color: '#fff', padding: 24, textAlign: 'center' }}>
        <Text style={{ margin: 0 }}>If you have any questions, contact us at <a href="mailto:support@edgefoodequipment.com" style={{ color: '#fff' }}>support@edgefoodequipment.com</a>.</Text>
      </Section>
    </Html>
  );
}
