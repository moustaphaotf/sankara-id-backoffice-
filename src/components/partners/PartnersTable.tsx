import React from 'react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { EyeIcon, PencilIcon, StopIcon } from '@heroicons/react/24/outline';
import { Partner } from '../../types/partner';
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

interface PartnersTableProps {
  partners: Partner[];
  onViewDetails: (partner: Partner) => void;
  onEdit: (partner: Partner) => void;
  onSuspend: (partner: Partner) => void;
}

export const PartnersTable: React.FC<PartnersTableProps> = ({
  partners,
  onViewDetails,
  onEdit,
  onSuspend,
}) => {
  const { t, i18n } = useTranslation();

  const getStatusBadge = (status: Partner['status']) => {
    const variants = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      suspended: 'error',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {t(`partners.${status}`)}
      </Badge>
    );
  };

  const getTierBadge = (tier: Partner['tier']) => {
    const variants = {
      basic: 'default',
      premium: 'info',
      enterprise: 'success',
    } as const;

    return (
      <Badge variant={variants[tier]}>
        {t(`partners.${tier}`)}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', {
      locale: i18n.language === 'fr' ? fr : enUS,
    });
  };

  const formatQuota = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 min-w-max">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t('partners.name')}
            </TableHead>
            <TableHead>
              {t('partners.status')}
            </TableHead>
            <TableHead>
              {t('partners.tier')}
            </TableHead>
            <TableHead>
              {t('partners.documents')}
            </TableHead>
            <TableHead>
              {t('partners.quota')}
            </TableHead>
            <TableHead>
              {t('partners.lastActivity')}
            </TableHead>
            <TableHead className="text-right">
              {t('partners.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow
              key={partner.id}
            >
              <TableCell>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {partner.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {partner.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(partner.status)}
              </TableCell>
              <TableCell>
                {getTierBadge(partner.tier)}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {partner.totalDocuments.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="w-32">
                  {formatQuota(partner.usedQuota, partner.monthlyQuota)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDate(partner.lastActivity)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(partner)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(partner)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  {partner.status !== 'suspended' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onSuspend(partner)}
                    >
                      <StopIcon className="h-4 w-4" />
                    </Button>
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