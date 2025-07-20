import React, { useState } from 'react';
import { DocumentsTable } from '../components/documents/DocumentsTable';
import { Filters } from '../components/common/Filters';
import { Pagination } from '../components/common/Pagination';
import { Card } from '../components/ui/card';
import { useDocuments, useUpdateDocumentStatus } from '../hooks/useDocuments';
import { Document } from '../types/partner';
import { useTranslation } from 'react-i18next';

export const Documents: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data: documentsData, 
    isLoading, 
    error 
  } = useDocuments({
    search,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    page: currentPage,
    limit: 10,
  });

  const updateDocumentStatus = useUpdateDocumentStatus();

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
    updateDocumentStatus.mutate({
      id: document.id,
      status: 'approved',
    });
  };

  const handleReject = async (document: Document) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    updateDocumentStatus.mutate({
      id: document.id,
      status: 'rejected',
      rejectionReason: reason,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          {error.message || 'Erreur lors du chargement des documents'}
        </div>
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

      <Card>
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