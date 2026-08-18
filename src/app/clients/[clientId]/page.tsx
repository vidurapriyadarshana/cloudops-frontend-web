'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { Client, Subscription, Invoice, License } from '@/lib/types';

export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const [client, setClient] = useState<Client | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [c, s, i, l] = await Promise.all([
          api.getClientById(clientId),
          api.getSubscriptionsByClient(clientId).catch(() => []),
          api.getInvoicesByClient(clientId).catch(() => []),
          api.getLicensesByClient(clientId).catch(() => []),
        ]);
        setClient(c);
        setSubscriptions(s);
        setInvoices(i);
        setLicenses(l);
      } catch (err) {
        console.error('Failed to load client details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [clientId]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading client profile...</div>;
  }

  if (!client) {
    return <div className="p-8 text-center text-xs text-rose-400">Client profile not found.</div>;
  }

  return (
    <div className="space-y-8">
      <Header
        title={client.companyName}
        description={`Client ID: ${client.id}`}
        actionButton={
          <div className="flex space-x-3">
            <Link
              href="/subscriptions/new"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20"
            >
              + Create Subscription
            </Link>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-white mb-2">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-400 block mb-1">Contact Email</span>
            <span className="text-blue-400 font-semibold">{client.contactEmail}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Contact Phone</span>
            <span className="text-gray-200">{client.contactPhone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Account Status</span>
            <StatusBadge status={client.status} />
          </div>
        </div>
        {client.address && (
          <div className="pt-2 border-t border-gray-800/60">
            <span className="text-gray-400 block mb-1">Billing Address</span>
            <span className="text-gray-200">{client.address}</span>
          </div>
        )}
      </div>

      {/* Subscriptions Section */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-xs">
        <h2 className="text-sm font-bold text-white mb-4">Active Subscriptions ({subscriptions.length})</h2>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500">No active subscriptions registered.</p>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-white block">Product: {sub.productId}</span>
                  <span className="text-gray-400">Plan: {sub.planTier} (${sub.monthlyAmount}/mo)</span>
                </div>
                <StatusBadge status={sub.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
