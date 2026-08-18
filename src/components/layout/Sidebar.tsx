'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Clients', href: '/clients', icon: '🏢' },
  { label: 'Subscriptions', href: '/subscriptions', icon: '🔄' },
  { label: 'Invoices', href: '/invoices', icon: '🧾' },
  { label: 'Payments', href: '/payments', icon: '💳' },
  { label: 'Product Catalog', href: '/products', icon: '📦' },
  { label: 'License Keys', href: '/licenses', icon: '🔑' },
  { label: 'Service Desk Tickets', href: '/tickets', icon: '🎫' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel flex flex-col min-h-screen border-r border-gray-800 fixed left-0 top-0 z-30">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
          C
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">CloudOps PSA</h1>
          <p className="text-xs text-blue-400 font-medium">v2.0.0 Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-200 truncate">CloudOps Ops Team</p>
            <p className="text-[10px] text-gray-400 truncate">admin@cloudops.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
