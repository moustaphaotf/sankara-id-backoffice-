import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Partner } from '@/types/partner';
import { PaginatedResponse, FilterParams } from '@/types/api';

const PARTNERS_QUERY_KEY = 'partners';

// Fetch partners with filters
export const usePartners = (filters: FilterParams) => {
  return useQuery({
    queryKey: [PARTNERS_QUERY_KEY, filters],
    queryFn: async (): Promise<PaginatedResponse<Partner>> => {
      const searchParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const url = searchParams.toString() 
        ? `/api/partners?${searchParams}` 
        : '/api/partners';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors du chargement des partenaires');
      }
      
      return {
        data: result.data,
        pagination: result.pagination,
      };
    },
  });
};

// Fetch single partner
export const usePartner = (id: string) => {
  return useQuery({
    queryKey: [PARTNERS_QUERY_KEY, id],
    queryFn: async (): Promise<Partner> => {
      const response = await fetch(`/api/partners/${id}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Partenaire non trouvé');
      }
      
      return result.data;
    },
    enabled: !!id,
  });
};

// Update partner status
export const useUpdatePartnerStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Partner['status'] }) => {
      const response = await fetch(`/api/partners/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalider toutes les requêtes partners pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: [PARTNERS_QUERY_KEY] });
    },
  });
};