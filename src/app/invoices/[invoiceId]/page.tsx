'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { Invoice, Payment } from '@/lib/types';

export default function InvoiceDetailPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [inv, pmts] = await Promise.all([
          api.getInvoiceById(invoiceId),
          api.getPaymentsByInvoice(invoiceId).catch(() => []),
        ]);
        setInvoice(inv);
        setPayments(pmts);
      } catch (err) {
        console.error('Error fetching invoice details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [invoiceId]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading invoice details...</div>;
  if (!invoice) return <div className="p-8 text-center text-xs text-rose-400">Invoice not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Header
        title={`Invoice: ${invoice.invoiceNumber}`}
        description={`Issued for Client: ${invoice.companyName || invoice.clientId}`}
        actionButton={
          invoice.status !== 'PAID' ? (
            <Link
              href={`/payments/new?invoiceId=${invoice.id}&amount=${invoice.totalAmount}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20"
            >
              💳 Record Payment
            </Link>
          ) : (
            <span className="text-emerald-400 font-bold text-xs">✓ FULLY PAID</span>
          )
        }
      />

      <div className="glass-panel p-8 rounded-2xl border border-gray-800 space-y-6 text-xs">
        <div className="flex justify-between items-start border-b border-gray-800 pb-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Invoice Breakdown</h2>
            <p className="text-gray-400">Issue Date: {invoice.issueDate}</p>
            <p className="text-gray-400">Due Date: {invoice.dueDate}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-400 block mb-1">Amount Due</span>
            <span className="text-xl font-bold text-white">${invoice.amountDue}</span>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-400 block mb-1">Tax Amount</span>
            <span className="text-xl font-bold text-gray-300">${invoice.taxAmount}</span>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-400 block mb-1">Total Payable</span>
            <span className="text-xl font-bold text-emerald-400">${invoice.totalAmount}</span>
          </div>
        </div>

        {invoice.gcsPdfUrl && (
          <div className="pt-4 border-t border-gray-800">
            <a
              href={invoice.gcsPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 font-semibold inline-flex items-center space-x-2 border border-blue-500/30"
            >
              <span>📄 Download Official GCS Invoice PDF</span>
            </a>
          </div>
        )}
      </div>

      {/* Payments breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-xs">
        <h3 className="text-sm font-bold text-white mb-4">Payment Transactions ({payments.length})</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500">No payment transactions recorded for this invoice.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-emerald-400 block">${p.amountPaid} via {p.paymentMethod}</span>
                  <span className="text-gray-400">Ref: {p.transactionReference || 'N/A'}</span>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
