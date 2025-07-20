import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PartnersTable } from '../components/partners/PartnersTable';
import { Filters } from '../components/common/Filters';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useApi } from '../hooks/useApi';
import { Partner } from '../types/partner';
import { PaginatedResponse } from '../types/api';
import { useLingo } from '@lingo-dev/react';

export const Partners: React.FC = () => {
  const { t } = useLingo();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: partnersData, loading, refetch } = useApi<PaginatedResponse<Partner>>(
    '/api/partners',
    {
      filters: {
        search,
        status: statusFilter || undefined,
        tier: tierFilter || undefined,
        page: currentPage,
        limit: 10,
      },
      dependencies: [search, statusFilter, tierFilter, currentPage],
    }
  );

  const partners = partnersData?.data || [];
  const pagination = partnersData?.pagination;

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setTierFilter('');
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: '', label: t('partners.filterStatus') },
    { value: 'active', label: t('partners.active') },
    { value: 'inactive', label: t('partners.inactive') },
    { value: 'pending', label: t('partners.pending') },
    { value: 'suspended', label: t('partners.suspended') },
  ];

  const tierOptions = [
    { value: '', label: t('partners.filterTier') },
    { value: 'basic', label: t('partners.basic') },
    { value: 'premium', label: t('partners.premium') },
    { value: 'enterprise', label: t('partners.enterprise') },
  ];

  const handleViewDetails = (partner: Partner) => {
    console.log('View details:', partner);
  };

  const handleEdit = (partner: Partner) => {
    console.log('Edit partner:', partner);
  };

  const handleSuspend = (partner: Partner) => {
    console.log('Suspend partner:', partner);
  };

  if (loading && !partnersData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('partners.title')}
        </h1>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('partners.addNew')}
        </Button>
      </div>

      <Filters
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: 'status',
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
          {
            key: 'tier',
            value: tierFilter,
            options: tierOptions,
            onChange: setTierFilter,
          },
        ]}
        onReset={handleReset}
      />

      <Card padding="none">
        <PartnersTable
          partners={partners}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onSuspend={handleSuspend}
        />
        
        {pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
};