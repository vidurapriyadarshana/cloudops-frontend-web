'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, description, actionButton }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-800">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </header>
  );
};
