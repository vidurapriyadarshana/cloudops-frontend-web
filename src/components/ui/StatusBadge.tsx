import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (stat: string) => {
    switch (stat.toUpperCase()) {
      case 'ACTIVE':
      case 'PAID':
      case 'COMPLETED':
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'UNPAID':
      case 'OPEN':
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'PENDING_CLIENT':
      case 'OVERDUE':
      case 'DEPRECATED':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'CANCELLED':
      case 'FAILED':
      case 'EXPIRED':
      case 'ARCHIVED':
      case 'INACTIVE':
      case 'SUSPENDED':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <span className={`badge-status ${getBadgeStyle(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
