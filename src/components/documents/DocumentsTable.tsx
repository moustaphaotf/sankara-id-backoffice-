import React from 'react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Document } from '../../types/partner';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface DocumentsTableProps {
  documents: Document[];
  onReview: (document: Document) => void;
  onApprove: (document: Document) => void;
  onReject: (document: Document) => void;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  onReview,
  onApprove,
  onReject,
}) => {
  const { t, i18n } = useTranslation();

  const getStatusBadge = (status: Document['status']) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      under_review: 'info',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {t(`documents.${status.replace('_', '')}`)}
      </Badge>
    );
  };

  const getTypeBadge = (type: Document['type']) => {
    return (
      <Badge variant="default">
        {t(`documents.${type.replace('_', '')}`)}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', {
      locale: i18n.language === 'fr' ? fr : enUS,
    });
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.fileName')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.partner')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.type')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.confidence')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.uploadedAt')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('documents.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((document) => (
            <tr
              key={document.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {document.fileName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(document.fileSize)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {document.partnerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTypeBadge(document.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(document.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-medium ${getConfidenceColor(document.confidence)}`}>
                  {(document.confidence * 100).toFixed(0)}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(document.uploadedAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReview(document)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  {document.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onApprove(document)}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onReject(document)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};