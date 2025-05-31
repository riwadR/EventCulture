// hooks/useLieux.ts

import { useState, useCallback } from 'react';
import { LieuService, LieuFilters, LieuCreateData, LieuUpdateData, DetailLieuCreateData, ServiceCreateData } from '../services/lieuService';
import { LieuType, WilayaType, DairaType, CommuneType, LocaliteType, DetailLieuType, ServiceType } from '../types/lieuType';
import { usePaginatedApi, useApi } from './useApi';

interface UseLieuxReturn {
  // État des lieux paginés
  lieux: LieuType[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  // Actions CRUD
  loadLieux: (page?: number, filters?: LieuFilters) => Promise<LieuType[] | null>;
  createLieu: (data: LieuCreateData) => Promise<LieuType | null>;
  updateLieu: (id: number, data: LieuUpdateData) => Promise<LieuType | null>;
  deleteLieu: (id: number) => Promise<boolean>;
  
  // Actions pour détails de lieu
  getDetailLieu: (lieuId: number) => Promise<DetailLieuType | null>;
  upsertDetailLieu: (lieuId: number, data: DetailLieuCreateData) => Promise<DetailLieuType | null>;
  
  // Actions pour services
  getServices: (lieuId: number) => Promise<ServiceType[] | null>;
  addService: (lieuId: number, data: ServiceCreateData) => Promise<ServiceType | null>;
  updateService: (serviceId: number, data: any) => Promise<ServiceType | null>;
  deleteService: (serviceId: number) => Promise<boolean>;
  
  // Actions géographiques
  loadLieuxByWilaya: (wilayaId: number, filters?: any) => Promise<LieuType[] | null>;
  loadLieuxByDaira: (dairaId: number, filters?: any) => Promise<LieuType[] | null>;
  loadLieuxByCommune: (communeId: number, filters?: any) => Promise<LieuType[] | null>;
  searchLieuxNearby: (latitude: number, longitude: number, radius?: number) => Promise<LieuType[] | null>;
  
  // Données géographiques
  getAllWilayas: () => Promise<WilayaType[] | null>;
  getDairasByWilaya: (wilayaId: number) => Promise<DairaType[] | null>;
  getCommunesByDaira: (dairaId: number) => Promise<CommuneType[] | null>;
  getLocalitesByCommune: (communeId: number) => Promise<LocaliteType[] | null>;
  
  // Recherche
  searchLieux: (query: string, filters?: LieuFilters) => Promise<LieuType[] | null>;
  
  // Utilitaires
  refresh: () => Promise<LieuType[] | null>;
  clearError: () => void;
  reset: () => void;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  formatFullAddress: (lieu: LieuType) => string;
  generateMapsUrl: (lieu: LieuType) => string;
  isValidCoordinates: (latitude: number, longitude: number) => boolean;
}

export const useLieux = (initialFilters?: LieuFilters): UseLieuxReturn => {
  const lieuService = LieuService.getInstance();
  
  // Hook pour la liste paginée des lieux
  const paginatedApi = usePaginatedApi(
    (filters) => lieuService.getAllLieux(filters),
    initialFilters
  );

  // Hooks pour les actions individuelles
  const createApi = useApi((data: LieuCreateData) => lieuService.createLieu(data));
  const updateApi = useApi((id: number, data: LieuUpdateData) => lieuService.updateLieu(id, data));
  const deleteApi = useApi((id: number) => lieuService.deleteLieu(id));
  const detailApi = useApi((lieuId: number) => lieuService.getDetailLieu(lieuId));
  const upsertDetailApi = useApi((lieuId: number, data: DetailLieuCreateData) => lieuService.upsertDetailLieu(lieuId, data));
  const servicesApi = useApi((lieuId: number) => lieuService.getServices(lieuId));
  const addServiceApi = useApi((lieuId: number, data: ServiceCreateData) => lieuService.addService(lieuId, data));
  const updateServiceApi = useApi((serviceId: number, data: any) => lieuService.updateService(serviceId, data));
  const deleteServiceApi = useApi((serviceId: number) => lieuService.deleteService(serviceId));

  // Créer un lieu
  const createLieu = useCallback(async (data: LieuCreateData): Promise<LieuType | null> => {
    const result = await createApi.execute(data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [createApi, paginatedApi]);

  // Mettre à jour un lieu
  const updateLieu = useCallback(async (id: number, data: LieuUpdateData): Promise<LieuType | null> => {
    const result = await updateApi.execute(id, data);
    if (result) {
      await paginatedApi.refresh();
    }
    return result;
  }, [updateApi, paginatedApi]);

  // Supprimer un lieu
  const deleteLieu = useCallback(async (id: number): Promise<boolean> => {
    const result = await deleteApi.execute(id);
    if (result !== null) {
      await paginatedApi.refresh();
      return true;
    }
    return false;
  }, [deleteApi, paginatedApi]);

  // Récupérer les détails d'un lieu
  const getDetailLieu = useCallback(async (lieuId: number): Promise<DetailLieuType | null> => {
    return await detailApi.execute(lieuId);
  }, [detailApi]);

  // Créer/mettre à jour les détails d'un lieu
  const upsertDetailLieu = useCallback(async (lieuId: number, data: DetailLieuCreateData): Promise<DetailLieuType | null> => {
    return await upsertDetailApi.execute(lieuId, data);
  }, [upsertDetailApi]);

  // Récupérer les services d'un lieu
  const getServices = useCallback(async (lieuId: number): Promise<ServiceType[] | null> => {
    return await servicesApi.execute(lieuId);
  }, [servicesApi]);

  // Ajouter un service à un lieu
  const addService = useCallback(async (lieuId: number, data: ServiceCreateData): Promise<ServiceType | null> => {
    return await addServiceApi.execute(lieuId, data);
  }, [addServiceApi]);

  // Mettre à jour un service
  const updateService = useCallback(async (serviceId: number, data: any): Promise<ServiceType | null> => {
    return await updateServiceApi.execute(serviceId, data);
  }, [updateServiceApi]);

  // Supprimer un service
  const deleteService = useCallback(async (serviceId: number): Promise<boolean> => {
    const result = await deleteServiceApi.execute(serviceId);
    return result !== null;
  }, [deleteServiceApi]);

  // Charger les lieux par wilaya
  const loadLieuxByWilaya = useCallback(async (wilayaId: number, filters?: any): Promise<LieuType[] | null> => {
    try {
      const response = await lieuService.getLieuxByWilaya(wilayaId, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Charger les lieux par daira
  const loadLieuxByDaira = useCallback(async (dairaId: number, filters?: any): Promise<LieuType[] | null> => {
    try {
      const response = await lieuService.getLieuxByDaira(dairaId, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Charger les lieux par commune
  const loadLieuxByCommune = useCallback(async (communeId: number, filters?: any): Promise<LieuType[] | null> => {
    try {
      const response = await lieuService.getLieuxByCommune(communeId, filters);
      return response.success ? response.data?.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Rechercher des lieux à proximité
  const searchLieuxNearby = useCallback(async (latitude: number, longitude: number, radius: number = 10): Promise<LieuType[] | null> => {
    try {
      const response = await lieuService.searchLieuxNearby(latitude, longitude, radius);
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Récupérer toutes les wilayas
  const getAllWilayas = useCallback(async (): Promise<WilayaType[] | null> => {
    try {
      const response = await lieuService.getAllWilayas();
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Récupérer les dairas d'une wilaya
  const getDairasByWilaya = useCallback(async (wilayaId: number): Promise<DairaType[] | null> => {
    try {
      const response = await lieuService.getDairasByWilaya(wilayaId);
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Récupérer les communes d'une daira
  const getCommunesByDaira = useCallback(async (dairaId: number): Promise<CommuneType[] | null> => {
    try {
      const response = await lieuService.getCommunesByDaira(dairaId);
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Récupérer les localités d'une commune
  const getLocalitesByCommune = useCallback(async (communeId: number): Promise<LocaliteType[] | null> => {
    try {
      const response = await lieuService.getLocalitesByCommune(communeId);
      return response.success ? response.data || [] : null;
    } catch {
      return null;
    }
  }, [lieuService]);

  // Rechercher des lieux
  const searchLieux = useCallback(async (query: string, filters?: LieuFil