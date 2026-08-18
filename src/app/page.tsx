'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/cards/StatsCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { api } from '@/lib/api';
import { Client, Subscription, Invoice, Ticket, Product } from '@/lib/types';

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [c, s, i, t, p] = await Promise.allSettled([
          api.getClients(),
          api.getSubscriptions(),
          api.getInvoices(),
          api.getTickets(),
          api.getProducts(),
        ]);

        if (c.status === 'fulfilled') setClients(c.value);
        if (s.status === 'fulfilled') setSubscriptions(s.value);
        if (i.status === 'fulfilled') setInvoices(i.value);
        if (t.status === 'fulfilled') setTickets(t.value);
        if (p.status === 'fulfilled') setProducts(p.value);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const openTicketsCount = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS'
  ).length;

  return (
    <div className="space-y-8">
      <Header
        title="Operations Dashboard"
        description="Real-time Professional Services Automation platform overview"
        actionButton={
          <div className="flex space-x-3">
            <Link
              href="/tickets/new"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all"
            >
              + Create Ticket
            </Link>
            <Link
              href="/clients/new"
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700 transition-all"
            >
              + Register Client
            </Link>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Active Clients"
          value={loading ? '...' : clients.length}
          subtitle="Registered accounts"
          icon="🏢"
          trend="+12%"
        />
        <StatsCard
          title="Active Subscriptions"
          value={loading ? '...' : subscriptions.length}
          subtitle="Recurring plans"
          icon="🔄"
          trend="+8%"
        />
        <StatsCard
          title="Total Paid Invoices"
          value={loading ? '...' : `$${totalRevenue.toLocaleString()}`}
          subtitle="Collected revenue"
          icon="💳"
          trend="+18%"
        />
        <StatsCard
          title="Open Helpdesk Tickets"
          value={loading ? '...' : openTicketsCount}
          subtitle="Pending SLA response"
          icon="🎫"
          trend={`${openTicketsCount} open`}
          trendUp={openTicketsCount === 0}
        />
      </div>

      {/* Two Column Layout: Recent Tickets & Active Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Helpdesk SLA Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>🎫 Recent Service Tickets</span>
            </h2>
            <Link href="/tickets" className="text-xs text-blue-400 hover:underline">
              View all
            </Link>
          </div>
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              No helpdesk tickets created yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {tickets.slice(0, 5).map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-gray-400">{t.ticketNumber}</span>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <Link
                      href={`/tickets/${t.id}`}
                      className="text-xs font-semibold text-gray-200 hover:text-blue-400 block truncate max-w-xs"
                    >
                      {t.subject}
                    </Link>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Catalog Overview */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>📦 Featured Products &amp; Catalog</span>
            </h2>
            <Link href="/products" className="text-xs text-blue-400 hover:underline">
              Browse Catalog
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              No products registered in catalog.
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-blue-400">{p.productId}</span>
                    <Link
                      href={`/products/${p.id}`}
                      className="text-xs font-semibold text-gray-200 hover:text-blue-400 block"
                    >
                      {p.name} ({p.version})
                    </Link>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
