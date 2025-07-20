import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Document } from '@/types/partner';
import { PaginatedResponse, FilterParams } from '@/types/api';

const DOCUMENTS_QUERY_KEY = 'documents';

// Fetch documents with filters
export const useDocuments = (filters: FilterParams) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, filters],
    queryFn: async (): Promise<PaginatedResponse<Document>> => {
      const searchParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const url = searchParams.toString() 
        ? `/api/documents?${searchParams}` 
        : '/api/documents';
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors du chargement des documents');
      }
      
      return {
        data: result.data,
        pagination: result.pagination,
      };
    },
  });
};

// Update document status
export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      rejectionReason 
    }: { 
      id: string; 
      status: Document['status']; 
      rejectionReason?: string;
    }) => {
      const response = await fetch(`/api/documents/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, rejectionReason }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }
      
      return result.data;
    },
    onSuccess: () => {
      // Invalider toutes les requêtes documents pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};