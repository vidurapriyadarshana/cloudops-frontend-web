'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Header
        title="Software Product Catalog"
        description="Startup software applications, API services, downloadable installers, and pricing tiers"
        actionButton={
          <Link
            href="/products/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            + Register New Product
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs text-gray-500">
            Loading product catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-gray-500 glass-panel rounded-2xl">
            No products registered. Click &quot;+ Register New Product&quot; to add one.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-blue-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {product.productId}
                  </span>
                  <StatusBadge status={product.status} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {product.description || 'Enterprise Cloud Software Suite'}
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                  <span className="px-2 py-0.5 rounded-md bg-gray-800">{product.category}</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-800">v{product.version}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <Link
                  href={`/tickets/new?productId=${product.productId}`}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  🎧 Get Help
                </Link>
                <Link
                  href={`/products/${product.id}`}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
