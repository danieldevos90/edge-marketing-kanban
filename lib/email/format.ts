export function formatCurrency(amount: number, currency: string = 'CAD') {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(amount);
}

export type Address = Partial<{
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  province_code: string;
  province: string;
  zip: string;
  country: string;
}>;

export function formatAddress(address: Address): string {
  const lines: string[] = [];

  const nameParts: string[] = [];
  if (address.first_name) nameParts.push(address.first_name);
  if (address.last_name) nameParts.push(address.last_name);
  if (nameParts.length) lines.push(nameParts.join(' '));

  if (address.company) lines.push(address.company);
  if (address.address1) lines.push(address.address1);
  if (address.address2) lines.push(address.address2);

  const cityLine: string[] = [];
  if (address.city) cityLine.push(address.city);
  const prov = address.province_code || address.province;
  if (prov) cityLine.push(prov);
  if (address.zip) cityLine.push(address.zip);
  if (cityLine.length) lines.push(cityLine.join(', '));

  if (address.country) lines.push(address.country);

  return lines.join('<br>');
}
