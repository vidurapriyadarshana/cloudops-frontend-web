'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { Subscription } from '@/lib/types';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await api.cancelSubscription(id);
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'CANCELLED' } : s))
      );
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="Active Subscriptions"
        description="Client product plans, billing cycles, and next renewal dates"
        actionButton={
          <Link
            href="/subscriptions/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            + New Subscription
          </Link>
        }
      />

      <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">Company</th>
                <th className="p-4">Product</th>
                <th className="p-4">Plan Tier</th>
                <th className="p-4">Monthly Amount</th>
                <th className="p-4">Next Renewal</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No subscriptions registered. Click &quot;+ New Subscription&quot; to create one.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-800/30">
                    <td className="p-4 font-semibold text-white">{sub.companyName || sub.clientId}</td>
                    <td className="p-4 text-blue-400 font-mono">{sub.productId}</td>
                    <td className="p-4 font-semibold text-gray-200">{sub.planTier}</td>
                    <td className="p-4 text-emerald-400 font-bold">${sub.monthlyAmount}</td>
                    <td className="p-4 text-gray-400">{sub.nextBillingDate}</td>
                    <td className="p-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="p-4">
                      {sub.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium border border-rose-500/30"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
