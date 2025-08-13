import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Edge Marketing Kanban',
  description: 'Centralized marketing platform for Edge Food Equipment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-[#0a0a0a]">
      <body className={`${inter.className} h-full antialiased`}>{children}</body>
    </html>
  );
}
