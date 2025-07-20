import React from 'react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { EyeIcon, PencilIcon, StopIcon } from '@heroicons/react/24/outline';
import { Partner } from '../../types/partner';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useLingo } from '@lingo-dev/react';

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
  const { t, locale } = useLingo();

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
      locale: locale === 'fr' ? fr : enUS,
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.tier')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.documents')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.quota')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.lastActivity')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('partners.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr
              key={partner.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {partner.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {partner.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(partner.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTierBadge(partner.tier)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {partner.totalDocuments.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-32">
                  {formatQuota(partner.usedQuota, partner.monthlyQuota)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(partner.lastActivity)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                      variant="danger"
                      size="sm"
                      onClick={() => onSuspend(partner)}
                    >
                      <StopIcon className="h-4 w-4" />
                    </Button>
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