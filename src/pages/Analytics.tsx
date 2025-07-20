import React from 'react';
import { useTranslation } from 'react-i18next';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('nav.analytics')}
      </h1>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">
          Page Analytics - À implémenter
        </p>
      </div>
    </div>
  );
};