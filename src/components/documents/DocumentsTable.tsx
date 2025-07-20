import React from 'react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Document } from '../../types/partner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t('documents.fileName')}
            </TableHead>
            <TableHead>
              {t('documents.partner')}
            </TableHead>
            <TableHead>
              {t('documents.type')}
            </TableHead>
            <TableHead>
              {t('documents.status')}
            </TableHead>
            <TableHead>
              {t('documents.confidence')}
            </TableHead>
            <TableHead>
              {t('documents.uploadedAt')}
            </TableHead>
            <TableHead className="text-right">
              {t('documents.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow
              key={document.id}
            >
              <TableCell>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {document.fileName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(document.fileSize)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {document.partnerName}
              </TableCell>
              <TableCell>
                {getTypeBadge(document.type)}
              </TableCell>
              <TableCell>
                {getStatusBadge(document.status)}
              </TableCell>
              <TableCell>
                <span className={`text-sm font-medium ${getConfidenceColor(document.confidence)}`}>
                  {(document.confidence * 100).toFixed(0)}%
                </span>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(document.uploadedAt)}
              </TableCell>
              <TableCell className="text-right">
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
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                        onClick={() => onApprove(document)}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject(document)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};