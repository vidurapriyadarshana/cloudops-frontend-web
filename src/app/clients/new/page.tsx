'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.createClient(form);
      router.push('/clients');
    } catch (err: any) {
      setError(err.message || 'Failed to create client account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Header
        title="Register New Client Account"
        description="Add a new enterprise client account for subscriptions and billing"
      />

      <div className="glass-panel p-8 rounded-2xl border border-gray-800">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Technologies Ltd"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Contact Email *</label>
            <input
              type="email"
              required
              placeholder="billing@acme.com"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Contact Phone</label>
            <input
              type="text"
              placeholder="+94-77-123-4567"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Billing Address</label>
            <textarea
              rows={3}
              placeholder="42 Galle Road, Colombo 03, Sri Lanka"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Register Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
