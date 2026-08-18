'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { License } from '@/lib/types';

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getLicenses();
        setLicenses(data);
      } catch (err) {
        console.error('Error fetching licenses:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this license key?')) return;
    try {
      await api.revokeLicense(id);
      setLicenses((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isActive: false } : l))
      );
    } catch (err) {
      alert('Failed to revoke license');
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="License Keys &amp; Entitlements"
        description="Issued software license keys, client seat allocation, and expiration management"
        actionButton={
          <Link
            href="/licenses/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            + Issue New License
          </Link>
        }
      />

      <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-4">License Key</th>
                <th className="p-4">Client ID</th>
                <th className="p-4">Product Code</th>
                <th className="p-4">Plan Tier</th>
                <th className="p-4">Seats Allocated</th>
                <th className="p-4">Valid Until</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Loading license keys...
                  </td>
                </tr>
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No license keys issued yet. Click &quot;+ Issue New License&quot; to generate one.
                  </td>
                </tr>
              ) : (
                licenses.map((lic) => (
                  <tr key={lic.id} className="hover:bg-gray-800/30">
                    <td className="p-4 font-mono font-bold text-amber-400">{lic.licenseKey}</td>
                    <td className="p-4 text-gray-400 font-mono text-[10px]">{lic.clientId}</td>
                    <td className="p-4 text-blue-400 font-mono">{lic.productId}</td>
                    <td className="p-4 font-semibold text-gray-200">{lic.planTier}</td>
                    <td className="p-4 font-semibold text-gray-300">
                      {lic.assignedSeats} / {lic.maxSeats} seats
                    </td>
                    <td className="p-4 text-gray-400">{lic.validUntil}</td>
                    <td className="p-4">
                      <StatusBadge status={lic.isActive ? 'ACTIVE' : 'EXPIRED'} />
                    </td>
                    <td className="p-4">
                      {lic.isActive && (
                        <button
                          onClick={() => handleRevoke(lic.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium border border-rose-500/30"
                        >
                          Revoke
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
