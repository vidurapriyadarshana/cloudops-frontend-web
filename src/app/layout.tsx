import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'CloudOps PSA — Startup Service Desk, Product & Billing Operations Platform',
  description: 'Enterprise Cloud Operations Platform built with Next.js, Spring Cloud, and GCP Infrastructure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex">
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen flex flex-col p-8">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
