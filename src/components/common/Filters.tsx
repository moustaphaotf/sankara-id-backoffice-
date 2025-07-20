import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface FiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: Array<{
    key: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }>;
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  searchValue,
  onSearchChange,
  filters,
  onReset,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-64">
          <Input
            type="text"
            placeholder={t('common.search')}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<MagnifyingGlassIcon />}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="min-w-48">
            <Select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              options={filter.options}
            />
          </div>
        ))}

        <Button variant="outline" onClick={onReset}>
          <FunnelIcon className="h-4 w-4 mr-2" />
          {t('common.reset')}
        </Button>
      </div>
    </div>
  );
};