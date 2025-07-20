import React from 'react';
import {
  UsersIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DocumentChart } from '../components/dashboard/DocumentChart';
import { useApi } from '../hooks/useApi';
import { Analytics } from '../types/partner';
import { useLingo } from '@lingo-dev/react';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { t } = useLingo();
  const { user } = useAuth();
  const { data: analytics, loading } = useApi<Analytics>('/api/analytics');

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600">
          {t('dashboard.welcome', { name: user?.name })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.totalPartners')}
          value={analytics.totalPartners.toLocaleString()}
          icon={<UsersIcon />}
        />
        <StatsCard
          title={t('dashboard.activePartners')}
          value={analytics.activePartners.toLocaleString()}
          icon={<UsersIcon />}
        />
        <StatsCard
          title={t('dashboard.totalDocuments')}
          value={analytics.totalDocuments.toLocaleString()}
          change={{ value: analytics.monthlyGrowth * 100, type: 'increase' }}
          icon={<DocumentTextIcon />}
        />
        <StatsCard
          title={t('dashboard.pendingDocuments')}
          value={analytics.pendingDocuments.toLocaleString()}
          icon={<ClockIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentChart data={analytics.dailyStats} />
        </div>
        
        <div className="space-y-6">
          <StatsCard
            title={t('dashboard.approvalRate')}
            value={`${(analytics.approvalRate * 100).toFixed(1)}%`}
            change={{ value: 2.3, type: 'increase' }}
            icon={<ChartBarIcon />}
          />
          <StatsCard
            title={t('dashboard.processingTime')}
            value={`${analytics.averageProcessingTime}h`}
            change={{ value: 15, type: 'decrease' }}
            icon={<ClockIcon />}
          />
        </div>
      </div>
    </div>
  );
};