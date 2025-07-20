import { useState, useEffect } from 'react';
import { FilterParams, PaginatedResponse, ApiResponse } from '../types/api';

export const useApi = <T>(
  url: string,
  options?: {
    filters?: FilterParams;
    dependencies?: any[];
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });
      }

      const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;
      const response = await fetch(fullUrl);
      const result = await response.json();

      if (result.success) {
        setData(result.data || result);
      } else {
        setError(result.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, ...(options?.dependencies || [])]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export const useApiMutation = <T, P = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    url: string,
    options: {
      method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: P;
    }
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Une erreur est survenue');
        return null;
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Mutation Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
};