'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { FileUpload } from '@/components/ui/FileUpload';
import { api } from '@/lib/api';
import { Client, Product } from '@/lib/types';

function NewTicketContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledProductId = searchParams.get('productId') || '';

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    clientId: '',
    productId: prefilledProductId,
    subject: '',
    description: '',
    priority: 'HIGH',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [c, p] = await Promise.all([api.getClients('ACTIVE'), api.getProducts()]);
        setClients(c);
        setProducts(p);
        if (c.length > 0) setForm((prev) => ({ ...prev, clientId: c[0].id }));
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
      await api.createTicket(form, files);
      router.push('/tickets');
    } catch (err: any) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Header
        title="Submit Helpdesk Ticket"
        description="Create support ticket with SLA priority timer and file attachment uploads"
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
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Related Product</label>
              <select
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">General Support Ticket</option>
                {products.map((p) => (
                  <option key={p.id} value={p.productId}>
                    {p.name} ({p.productId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Priority (SLA Timer) *</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="LOW">LOW (24 Hours SLA)</option>
                <option value="MEDIUM">MEDIUM (8 Hours SLA)</option>
                <option value="HIGH">HIGH (4 Hours SLA)</option>
                <option value="CRITICAL">CRITICAL (1 Hour SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Subject *</label>
            <input
              type="text"
              required
              placeholder="e.g. API Gateway Authentication Failure on Production"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Detailed Problem Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Provide exact error logs, steps to reproduce, and impact details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 border-t border-gray-800">
            <FileUpload
              label="Attach Screenshots / Log Files (Uploaded to GCS cloudops-ticket-attachments)"
              multiple
              onFilesSelected={(selectedFiles) => setFiles(selectedFiles)}
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
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewTicketPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading form...</div>}>
      <NewTicketContent />
    </Suspense>
  );
}
