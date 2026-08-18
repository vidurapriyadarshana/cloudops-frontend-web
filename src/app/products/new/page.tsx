'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { FileUpload } from '@/components/ui/FileUpload';
import { api } from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    productId: '',
    name: '',
    category: 'SaaS Platform',
    description: '',
    version: '1.0.0',
    features: ['SSO Integration', 'API Access', '24/7 Support'],
  });
  const [manualFile, setManualFile] = useState<File | undefined>();
  const [installerFile, setInstallerFile] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.createProduct(form, manualFile, installerFile);
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Header
        title="Register Product Catalog Entry"
        description="Add software products, user manuals, and installer assets"
      />

      <div className="glass-panel p-8 rounded-2xl border border-gray-800">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Product ID *</label>
              <input
                type="text"
                required
                placeholder="PROD-ERP-01"
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="API Service">API Service</option>
                <option value="Desktop App">Desktop App</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Product Name *</label>
            <input
              type="text"
              required
              placeholder="CloudOps ERP Suite"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Enterprise Cloud ERP Platform for automated startup workflow management"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Initial Version</label>
            <input
              type="text"
              placeholder="v1.0.0"
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-800">
            <FileUpload
              label="Upload User Manual PDF (GCS cloudops-product-assets)"
              accept=".pdf"
              onFilesSelected={(files) => setManualFile(files[0])}
            />
            <FileUpload
              label="Upload Software Build / Installer (GCS cloudops-product-assets)"
              accept=".zip,.exe,.dmg,.tar.gz"
              onFilesSelected={(files) => setInstallerFile(files[0])}
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
              {submitting ? 'Registering...' : 'Register Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
