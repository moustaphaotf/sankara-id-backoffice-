import React from 'react';
import { BellIcon, GlobeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Système de gestion KYC
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title={`Changer vers ${i18n.language === 'fr' ? 'English' : 'Français'}`}
          >
            <GlobeIcon className="h-5 w-5" />
            <span className="ml-1 text-sm font-medium">
              {i18n.language.toUpperCase()}
            </span>
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <BellIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role}
              </div>
            </div>
            <img
              className="h-8 w-8 rounded-full"
              src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'}
              alt="Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};