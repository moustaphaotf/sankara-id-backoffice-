import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
} from '@heroicons/react/24/outline';
import { useLingo } from '@lingo-dev/react';
import { useAuth } from '../../hooks/useAuth';
import { clsx } from 'clsx';

const navigation = [
  { name: 'dashboard', href: '/', icon: HomeIcon },
  { name: 'partners', href: '/partners', icon: UsersIcon },
  { name: 'documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'settings', href: '/settings', icon: CogIcon },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useLingo();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">KYC</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BackOffice</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5',
                  isActive ? 'text-blue-500' : 'text-gray-400'
                )}
              />
              {t(`nav.${item.name}`)}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          <LogoutIcon className="mr-3 h-5 w-5 text-gray-400" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};