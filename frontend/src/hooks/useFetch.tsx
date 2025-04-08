import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

// Import les types depuis le fichier de service API
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  headers?: Record<string, string>;
  method?: RequestMethod;
  body?: any;
}

interface FetchOptions extends RequestOptions {
  loadOnMount?: boolean;
  showErrorNotification?: boolean;
  [key: string]: any;
}

/**
 * Hook personnalisé pour gérer les requêtes API avec état de chargement et gestion des erreurs
 */
const useFetch = (initialUrl: string | null = null, initialOptions: FetchOptions = {}) => {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [options, setOptions] = useState<FetchOptions>(initialOptions);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotification();

  const fetchData = useCallback(async (fetchUrl: string | null = url, fetchOptions: FetchOptions = options): Promise<any | undefined> => {
    if (!fetchUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const method = (fetchOptions.method || 'GET').toUpperCase() as RequestMethod;
      let result;

      switch (method) {
        case 'GET':
          result = await apiService.get(fetchUrl);
          break;
        case 'POST':
          result = await apiService.post(fetchUrl, fetchOptions.body);
          break;
        case 'PUT':
          result = await apiService.put(fetchUrl, fetchOptions.body);
          break;
        case 'DELETE':
          result = await apiService.delete(fetchUrl);
          break;
        default:
          result = await apiService.request(fetchUrl, fetchOptions);
      }

      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      if (fetchOptions.showErrorNotification !== false) {
        showError(err.message || 'Une erreur est survenue');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, options, showError]);

  useEffect(() => {
    if (url && options.loadOnMount !== false) {
      fetchData();
    }
  }, [url, fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    refetch,
    setUrl,
    setOptions,
  };
};

export default useFetch; 