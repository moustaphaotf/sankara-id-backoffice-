import React, { useState } from 'react';
import { DocumentsTable } from '../components/documents/DocumentsTable';
import { Filters } from '../components/common/Filters';
import { Pagination } from '../components/common/Pagination';
import { Card } from '../components/ui/Card';
import { useApi, useApiMutation } from '../hooks/useApi';
import { Document } from '../types/partner';
import { PaginatedResponse } from '../types/api';
import { useLingo } from '@lingo-dev/react';

export const Documents: React.FC = () => {
  const { t } = useLingo();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: documentsData, loading, refetch } = useApi<PaginatedResponse<Document>>(
    '/api/documents',
    {
      filters: {
        search,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        page: currentPage,
        limit: 10,
      },
      dependencies: [search, statusFilter, typeFilter, currentPage],
    }
  );

  const { mutate: updateDocumentStatus } = useApiMutation<Document>();

  const documents = documentsData?.data || [];
  const pagination = documentsData?.pagination;

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: '', label: t('documents.filterStatus') },
    { value: 'pending', label: t('documents.pending') },
    { value: 'approved', label: t('documents.approved') },
    { value: 'rejected', label: t('documents.rejected') },
    { value: 'under_review', label: t('documents.underReview') },
  ];

  const typeOptions = [
    { value: '', label: t('documents.filterType') },
    { value: 'passport', label: t('documents.passport') },
    { value: 'id_card', label: t('documents.idCard') },
    { value: 'driving_license', label: t('documents.drivingLicense') },
    { value: 'utility_bill', label: t('documents.utilityBill') },
  ];

  const handleReview = (document: Document) => {
    console.log('Review document:', document);
  };

  const handleApprove = async (document: Document) => {
    const result = await updateDocumentStatus(`/api/documents/${document.id}/status`, {
      method: 'PUT',
      body: { status: 'approved' },
    });

    if (result) {
      refetch();
    }
  };

  const handleReject = async (document: Document) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    const result = await updateDocumentStatus(`/api/documents/${document.id}/status`, {
      method: 'PUT',
      body: { status: 'rejected', rejectionReason: reason },
    });

    if (result) {
      refetch();
    }
  };

  if (loading && !documentsData) {
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
          {t('documents.title')}
        </h1>
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
            key: 'type',
            value: typeFilter,
            options: typeOptions,
            onChange: setTypeFilter,
          },
        ]}
        onReset={handleReset}
      />

      <Card padding="none">
        <DocumentsTable
          documents={documents}
          onReview={handleReview}
          onApprove={handleApprove}
          onReject={handleReject}
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