import { useQuery } from '@tanstack/react-query';
import { Analytics } from '@/types/partner';

const ANALYTICS_QUERY_KEY = 'analytics';

export const useAnalytics = () => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEY],
    queryFn: async (): Promise<Analytics> => {
      const response = await fetch('/api/analytics');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors du chargement des analytics');
      }
      
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes pour les analytics
  });
};