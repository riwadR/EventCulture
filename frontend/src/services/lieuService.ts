// services/lieuService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { LieuType, TypeLieuEnum, WilayaType, DairaType, CommuneType, LocaliteType, DetailLieuType, ServiceType } from '../types/lieuType';

export interface LieuFilters {
  typeLieu?: TypeLieuEnum;
  wilayaId?: number;
  dairaId?: number;
  communeId?: number;
  localiteId?: number;
  nom?: string;
  search?: string;
  latitude_min?: number;
  latitude_max?: number;
  longitude_min?: number;
  longitude_max?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface LieuCreateData {
  typeLieu: TypeLieuEnum;
  wilayaId?: number;
  dairaId?: number;
  communeId?: number;
  localiteId?: number;
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  detailLieu?: DetailLieuCreateData;
  services?: ServiceCreateData[];
}

export interface LieuUpdateData {
  nom?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
}

export interface DetailLieuCreateData {
  description?: string;
  horaires?: string;
  histoire?: string;
  referencesHistoriques?: string;
}

export interface DetailLieuUpdateData {
  description?: string;
  horaires?: string;
  histoire?: string;
  referencesHistoriques?: string;
  noteMoyenne?: number;
}

export interface ServiceCreateData {
  nom: string;
  description?: string;
  gratuit: boolean;
}

export interface ServiceUpdateData {
  nom?: string;
  description?: string;
  gratuit?: boolean;
}

export interface LieuStats {
  totalLieux: number;
  lieuxByType: Record<TypeLieuEnum, number>;
  lieuxByWilaya: Record<string, number>;
  recentLieux: LieuType[];
  topLieux: LieuType[];
  averageRating: number;
}

export class LieuService {
  private static instance: LieuService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): LieuService {
    if (!LieuService.instance) {
      LieuService.instance = new LieuService();
    }
    return LieuService.instance;
  }

  // ===============================
  // CRUD LIEUX
  // ===============================

  // CREATE - Créer un lieu
  async createLieu(data: LieuCreateData): Promise<ApiResponse<LieuType>> {
    const validationError = this.validateLieuData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<LieuType>('/lieux', data);
  }

  // READ - Récupérer tous les lieux avec filtres
  async getAllLieux(filters?: LieuFilters): Promise<ApiResponse<PaginatedResponse<LieuType>>> {
    return this.apiService.get<PaginatedResponse<LieuType>>('/lieux', filters);
  }

  // READ - Récupérer un lieu par ID
  async getLieuById(id: number): Promise<ApiResponse<LieuType>> {
    return this.apiService.get<LieuType>(`/lieux/${id}`);
  }

  // READ - Récupérer les lieux par wilaya
  async getLieuxByWilaya(wilayaId: number, filters?: Omit<LieuFilters, 'wilayaId'>): Promise<ApiResponse<PaginatedResponse<LieuType>>> {
    return this.apiService.get<PaginatedResponse<LieuType>>(`/wilayas/${wilayaId}/lieux`, filters);
  }

  // READ - Récupérer les lieux par daira
  async getLieuxByDaira(dairaId: number, filters?: Omit<LieuFilters, 'dairaId'>): Promise<ApiResponse<PaginatedResponse<LieuType>>> {
    return this.apiService.get<PaginatedResponse<LieuType>>(`/dairas/${dairaId}/lieux`, filters);
  }

  // READ - Récupérer les lieux par commune
  async getLieuxByCommune(communeId: number, filters?: Omit<LieuFilters, 'communeId'>): Promise<ApiResponse<PaginatedResponse<LieuType>>> {
    return this.apiService.get<PaginatedResponse<LieuType>>(`/communes/${communeId}/lieux`, filters);
  }

  // READ - Recherche géographique
  async searchLieuxNearby(latitude: number, longitude: number, radius: number = 10): Promise<ApiResponse<LieuType[]>> {
    return this.apiService.get<LieuType[]>('/lieux/nearby', {
      latitude,
      longitude,
      radius
    });
  }

  // UPDATE - Mettre à jour un lieu
  async updateLieu(id: number, data: LieuUpdateData): Promise<ApiResponse<LieuType>> {
    return this.apiService.put<LieuType>(`/lieux/${id}`, data);
  }

  // DELETE - Supprimer un lieu
  async deleteLieu(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/lieux/${id}`);
  }

  // ===============================
  // GESTION DES DÉTAILS DE LIEU
  // ===============================

  // CREATE/UPDATE - Créer ou mettre à jour les détails d'un lieu
  async upsertDetailLieu(lieuId: number, data: DetailLieuCreateData): Promise<ApiResponse<DetailLieuType>> {
    return this.apiService.post<DetailLieuType>(`/lieux/${lieuId}/detail`, data);
  }

  // READ - Récupérer les détails d'un lieu
  async getDetailLieu(lieuId: number): Promise<ApiResponse<DetailLieuType>> {
    return this.apiService.get<DetailLieuType>(`/lieux/${lieuId}/detail`);
  }

  // UPDATE - Mettre à jour les détails d'un lieu
  async updateDetailLieu(lieuId: number, data: DetailLieuUpdateData): Promise<ApiResponse<DetailLieuType>> {
    return this.apiService.put<DetailLieuType>(`/lieux/${lieuId}/detail`, data);
  }

  // ===============================
  // GESTION DES SERVICES
  // ===============================

  // CREATE - Ajouter un service à un lieu
  async addService(lieuId: number, data: ServiceCreateData): Promise<ApiResponse<ServiceType>> {
    return this.apiService.post<ServiceType>(`/lieux/${lieuId}/services`, data);
  }

  // READ - Récupérer les services d'un lieu
  async getServices(lieuId: number): Promise<ApiResponse<ServiceType[]>> {
    return this.apiService.get<ServiceType[]>(`/lieux/${lieuId}/services`);
  }

  // UPDATE - Mettre à jour un service
  async updateService(serviceId: number, data: ServiceUpdateData): Promise<ApiResponse<ServiceType>> {
    return this.apiService.put<ServiceType>(`/services/${serviceId}`, data);
  }

  // DELETE - Supprimer un service
  async deleteService(serviceId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/services/${serviceId}`);
  }

  // ===============================
  // DONNÉES GÉOGRAPHIQUES
  // ===============================

  // READ - Récupérer toutes les wilayas
  async getAllWilayas(): Promise<ApiResponse<WilayaType[]>> {
    return this.apiService.get<WilayaType[]>('/wilayas');
  }

  // READ - Récupérer une wilaya par ID
  async getWilayaById(id: number): Promise<ApiResponse<WilayaType>> {
    return this.apiService.get<WilayaType>(`/wilayas/${id}`);
  }

  // READ - Récupérer les dairas d'une wilaya
  async getDairasByWilaya(wilayaId: number): Promise<ApiResponse<DairaType[]>> {
    return this.apiService.get<DairaType[]>(`/wilayas/${wilayaId}/dairas`);
  }

  // READ - Récupérer les communes d'une daira
  async getCommunesByDaira(dairaId: number): Promise<ApiResponse<CommuneType[]>> {
    return this.apiService.get<CommuneType[]>(`/dairas/${dairaId}/communes`);
  }

  // READ - Récupérer les localités d'une commune
  async getLocalitesByCommune(communeId: number): Promise<ApiResponse<LocaliteType[]>> {
    return this.apiService.get<LocaliteType[]>(`/communes/${communeId}/localites`);
  }

  // ===============================
  // RECHERCHE ET STATISTIQUES
  // ===============================

  // SEARCH - Rechercher des lieux
  async searchLieux(query: string, filters?: Omit<LieuFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<LieuType>>> {
    return this.apiService.get<PaginatedResponse<LieuType>>('/lieux/search', { 
      search: query, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des lieux
  async getLieuStats(): Promise<ApiResponse<LieuStats>> {
    return this.apiService.get<LieuStats>('/lieux/stats');
  }

  // ===============================
  // UTILITAIRES
  // ===============================

  // Calculer la distance entre deux points
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Formater l'adresse complète
  formatFullAddress(lieu: LieuType): string {
    const parts = [lieu.adresse];
    
    if (lieu.commune?.nom) parts.push(lieu.commune.nom);
    if (lieu.daira?.nom) parts.push(lieu.daira.nom);
    if (lieu.wilaya?.nom) parts.push(lieu.wilaya.nom);
    
    return parts.join(', ');
  }

  // Obtenir les types de lieux disponibles
  getLieuTypes(): TypeLieuEnum[] {
    return Object.values(TypeLieuEnum);
  }

  // Valider les coordonnées
  isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }

  // Générer une URL Google Maps
  generateMapsUrl(lieu: LieuType): string {
    return `https://www.google.com/maps?q=${lieu.latitude},${lieu.longitude}`;
  }

  // ===============================
  // VALIDATION
  // ===============================

  private validateLieuData(data: LieuCreateData): string | null {
    if (!data.nom?.trim()) return 'Le nom du lieu est requis';
    if (!data.adresse?.trim()) return 'L\'adresse est requise';
    if (!data.typeLieu) return 'Le type de lieu est requis';

    // Validation des coordonnées
    if (!this.isValidCoordinates(data.latitude, data.longitude)) {
      return 'Coordonnées géographiques invalides';
    }

    // Validation selon le type de lieu
    switch (data.typeLieu) {
      case TypeLieuEnum.WILAYA:
        if (!data.wilayaId) return 'ID de wilaya requis pour ce type de lieu';
        break;
      case TypeLieuEnum.DAIRA:
        if (!data.dairaId) return 'ID de daïra requis pour ce type de lieu';
        break;
      case TypeLieuEnum.COMMUNE:
        if (!data.communeId) return 'ID de commune requis pour ce type de lieu';
        break;
    }

    return null;
  }
}