// hooks/useApi.ts

import { useState, useCallback } from 'react';
import { ApiResponse } from '../services/apiService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  clearError: () => void;
}

export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null
        });
        return response.data;
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Une erreur est survenue'
        });
        return null;
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: 'Erreur de connexion au serveur'
      });
      return null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError
  };
};

// Hook spécialisé pour les listes paginées
interface UsePaginatedApiState<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

interface UsePaginatedApiReturn<T> extends UsePaginatedApiState<T> {
  execute: (page?: number, filters?: any) => Promise<T[] | null>;
  loadMore: () => Promise<T[] | null>;
  refresh: () => Promise<T[] | null>;
  reset: () => void;
  clearError: () => void;
}

export const usePaginatedApi = <T>(
  apiFunction: (filters?: any) => Promise<ApiResponse<{
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  }>>,
  initialFilters: any = {}
): UsePaginatedApiReturn<T> => {
  const [state, setState] = useState<UsePaginatedApiState<T>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
    loading: false,
    error: null
  });

  const [currentFilters, setCurrentFilters] = useState(initialFilters);

  const execute = useCallback(async (page: number = 1, filters: any = currentFilters): Promise<T[] | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction({ ...filters, page });
      
      if (response.success && response.data) {
        const newData = page === 1 ? response.data.data : [...state.data, ...response.data.data];
        
        setState({
          data: newData,
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
          loading: false,
          error: null
        });
        
        setCurrentFilters(filters);
        return response.data.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Une erreur est survenue'
        }));
        return null;
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur de connexion au serveur'
      }));
      return null;
    }
  }, [apiFunction, currentFilters, state.data]);

  const loadMore = useCallback(async (): Promise<T[] | null> => {
    if (state.page >= state.totalPages) return null;
    return execute(state.page + 1, currentFilters);
  }, [execute, state.page, state.totalPages, currentFilters]);

  const refresh = useCallback(async (): Promise<T[] | null> => {
    return execute(1, currentFilters);
  }, [execute, currentFilters]);

  const reset = useCallback(() => {
    setState({
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
      loading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    loadMore,
    refresh,
    reset,
    clearError
  };
};