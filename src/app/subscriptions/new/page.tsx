'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { Client, Product } from '@/lib/types';

export default function NewSubscriptionPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    clientId: '',
    productId: '',
    planTier: 'PRO',
    monthlyAmount: 99.00,
    billingCycle: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [c, p] = await Promise.all([api.getClients('ACTIVE'), api.getProducts('ACTIVE')]);
        setClients(c);
        setProducts(p);
        if (c.length > 0) setForm((prev) => ({ ...prev, clientId: c[0].id }));
        if (p.length > 0) setForm((prev) => ({ ...prev, productId: p[0].productId }));
      } catch (err) {
        console.error('Failed to load select data:', err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.createSubscription({
        ...form,
        monthlyAmount: Number(form.monthlyAmount),
      });
      router.push('/subscriptions');
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Header
        title="Create Product Subscription"
        description="Link a client account to a software product plan"
      />

      <div className="glass-panel p-8 rounded-2xl border border-gray-800">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Select Client Company *</label>
            <select
              required
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              {clients.length === 0 && <option value="">No active clients available</option>}
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.contactEmail})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Select Product *</label>
            <select
              required
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              {products.length === 0 && <option value="">No products available</option>}
              {products.map((p) => (
                <option key={p.id} value={p.productId}>
                  {p.name} ({p.productId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Plan Tier *</label>
              <select
                value={form.planTier}
                onChange={(e) => setForm({ ...form, planTier: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="BASIC">BASIC</option>
                <option value="PRO">PRO</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Monthly Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.monthlyAmount}
                onChange={(e) => setForm({ ...form, monthlyAmount: parseFloat(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Billing Cycle</label>
              <select
                value={form.billingCycle}
                onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Activate Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
