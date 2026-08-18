'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await api.getProductById(productId);
        setProduct(p);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading product asset details...</div>;
  if (!product) return <div className="p-8 text-center text-xs text-rose-400">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Header
        title={product.name}
        description={`Product Code: ${product.productId} | Version ${product.version}`}
        actionButton={
          <div className="flex space-x-3">
            <Link
              href={`/tickets/new?productId=${product.productId}`}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-500/20"
            >
              🎧 Get Help for this Product
            </Link>
          </div>
        }
      />

      <div className="glass-panel p-8 rounded-2xl border border-gray-800 space-y-6 text-xs">
        <div className="flex justify-between items-start border-b border-gray-800 pb-4">
          <div>
            <span className="text-gray-400 block mb-1">Category</span>
            <span className="text-gray-200 font-semibold">{product.category}</span>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2">Description</h3>
          <p className="text-gray-300 leading-relaxed">
            {product.description || 'No detailed description provided for this software application.'}
          </p>
        </div>

        {/* Downloadable Assets */}
        <div className="pt-4 border-t border-gray-800 space-y-3">
          <h3 className="text-sm font-bold text-white">GCS Cloud Storage Assets</h3>
          <div className="flex flex-wrap gap-4">
            {product.gcsManualUrl ? (
              <a
                href={product.gcsManualUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30 hover:underline"
              >
                📖 Download User Manual PDF
              </a>
            ) : (
              <span className="text-gray-500">No User Manual uploaded</span>
            )}

            {product.gcsInstallerUrl ? (
              <a
                href={product.gcsInstallerUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 font-semibold border border-emerald-500/30 hover:underline"
              >
                💾 Download Software Build / Installer
              </a>
            ) : (
              <span className="text-gray-500">No Installer Build uploaded</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
