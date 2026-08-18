'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { Invoice } from '@/lib/types';

function RecordPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialInvoiceId = searchParams.get('invoiceId') || '';
  const initialAmount = searchParams.get('amount') || '';

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState({
    invoiceId: initialInvoiceId,
    amountPaid: initialAmount ? parseFloat(initialAmount) : 0,
    paymentMethod: 'CREDIT_CARD',
    transactionReference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const invs = await api.getInvoices('UNPAID');
        setInvoices(invs);
        if (invs.length > 0 && !initialInvoiceId) {
          setForm((prev) => ({
            ...prev,
            invoiceId: invs[0].id,
            amountPaid: invs[0].totalAmount,
          }));
        }
      } catch (err) {
        console.error('Failed to load invoices:', err);
      }
    }
    loadData();
  }, [initialInvoiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.recordPayment({
        ...form,
        amountPaid: Number(form.amountPaid),
      });
      router.push('/payments');
    } catch (err: any) {
      setError(err.message || 'Failed to record payment transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Header
        title="Record Payment Transaction"
        description="Process payment for an outstanding invoice"
      />

      <div className="glass-panel p-8 rounded-2xl border border-gray-800">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Target Invoice *</label>
            <select
              required
              value={form.invoiceId}
              onChange={(e) => {
                const id = e.target.value;
                const found = invoices.find((i) => i.id === id);
                setForm({
                  ...form,
                  invoiceId: id,
                  amountPaid: found ? found.totalAmount : form.amountPaid,
                });
              }}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select an invoice</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - ${inv.totalAmount} ({inv.companyName || 'Client'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Amount Paid ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amountPaid}
                onChange={(e) => setForm({ ...form, amountPaid: parseFloat(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Payment Method *</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="CREDIT_CARD">CREDIT_CARD</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                <option value="PAYPAL">PAYPAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Transaction Reference</label>
            <input
              type="text"
              value={form.transactionReference}
              onChange={(e) => setForm({ ...form, transactionReference: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RecordPaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading form...</div>}>
      <RecordPaymentContent />
    </Suspense>
  );
}
