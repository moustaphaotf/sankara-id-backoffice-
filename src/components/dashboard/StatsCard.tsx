import React from 'react';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  return (
    <Card className={clsx('transition-all duration-200 hover:shadow-md', className)}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={clsx(
                  'text-sm font-medium',
                  change.type === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {change.type === 'increase' ? '+' : '-'}
                {Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-blue-50 rounded-lg">
            <div className="h-6 w-6 text-blue-600">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
};