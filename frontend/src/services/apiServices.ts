// services/apiServices.ts - Services pour les appels API

import type { 
  ApiResponse, 
  PaginatedResponse,
  PaginationParams 
} from '../types/base';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  ChangePasswordData,
  UpdateProfileData 
} from '../types/user';
import type { 
  Oeuvre, 
  OeuvreFilters, 
  CreateOeuvreData, 
  UpdateOeuvreData,
  SearchOeuvresParams,
  ValidationOeuvreData 
} from '../types/oeuvre';
import type { 
  Evenement, 
  EvenementFilters, 
  CreateEvenementData,
  SearchEvenementsParams,
  InscriptionEvenementData 
} from '../types/event';
import type { 
  Lieu, 
  LieuFilters, 
  PatrimoineSearchParams,
  CreateLieuData,
  ProximiteFilters 
} from '../types/place';
import type {
  Commentaire,
  CreateCommentaireData,
  CommentaireFilters
} from '../types/media-comment';
import { tokenStorage } from '../utils/storage';
import { API_ENDPOINTS } from '../types/base';

// =============================================================================
// CONFIGURATION DE BASE
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const token = tokenStorage.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur de connexion');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// =============================================================================
// SERVICE D'AUTHENTIFICATION
// =============================================================================

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    return response.data!;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER, 
      data
    );
    return response.data!;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.PROFILE
    );
    return response.data!;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.PROFILE, 
      data
    );
    return response.data!;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiClient.post<ApiResponse<void>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD, 
      data
    );
  },
};

// =============================================================================
// SERVICE DES ŒUVRES
// =============================================================================

export const oeuvreService = {
  async getAll(filters: OeuvreFilters & PaginationParams): Promise<PaginatedResponse<Oeuvre>> {
    return apiClient.get<PaginatedResponse<Oeuvre>>(API_ENDPOINTS.OEUVRES, filters);
  },

  async getById(id: number): Promise<Oeuvre> {
    const response = await apiClient.get<ApiResponse<Oeuvre>>(`${API_ENDPOINTS.OEUVRES}/${id}`);
    return response.data!;
  },

  async create(data: CreateOeuvreData): Promise<Oeuvre> {
    const response = await apiClient.post<ApiResponse<Oeuvre>>(API_ENDPOINTS.OEUVRES, data);
    return response.data!;
  },

  async update(id: number, data: UpdateOeuvreData): Promise<Oeuvre> {
    const response = await apiClient.put<ApiResponse<Oeuvre>>(`${API_ENDPOINTS.OEUVRES}/${id}`, data);
    return response.data!;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.OEUVRES}/${id}`);
  },

  async validate(id: number, data: ValidationOeuvreData): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_ENDPOINTS.OEUVRES}/${id}/validate`, data);
  },

  async search(params: SearchOeuvresParams): Promise<Oeuvre[]> {
    const response = await apiClient.get<ApiResponse<Oeuvre[]>>(`${API_ENDPOINTS.OEUVRES}/search`, params);
    return response.data!;
  },

  async getByUser(userId: number, filters?: OeuvreFilters): Promise<Oeuvre[]> {
    const response = await apiClient.get<ApiResponse<Oeuvre[]>>(`${API_ENDPOINTS.USERS}/${userId}/oeuvres`, filters);
    return response.data!;
  },
};

// =============================================================================
// SERVICE DES ÉVÉNEMENTS
// =============================================================================

export const evenementService = {
  async getAll(filters: EvenementFilters & PaginationParams): Promise<PaginatedResponse<Evenement>> {
    return apiClient.get<PaginatedResponse<Evenement>>(API_ENDPOINTS.EVENEMENTS, filters);
  },

  async getById(id: number): Promise<Evenement> {
    const response = await apiClient.get<ApiResponse<Evenement>>(`${API_ENDPOINTS.EVENEMENTS}/${id}`);
    return response.data!;
  },

  async create(data: CreateEvenementData): Promise<Evenement> {
    const response = await apiClient.post<ApiResponse<Evenement>>(API_ENDPOINTS.EVENEMENTS, data);
    return response.data!;
  },

  async update(id: number, data: Partial<CreateEvenementData>): Promise<Evenement> {
    const response = await apiClient.put<ApiResponse<Evenement>>(`${API_ENDPOINTS.EVENEMENTS}/${id}`, data);
    return response.data!;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.EVENEMENTS}/${id}`);
  },

  async inscrire(id: number, data: InscriptionEvenementData): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_ENDPOINTS.EVENEMENTS}/${id}/inscription`, data);
  },

  async desinscrire(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.EVENEMENTS}/${id}/inscription`);
  },

  async getAVenir(params: { limit?: number; wilaya?: number } = {}): Promise<Evenement[]> {
    const response = await apiClient.get<ApiResponse<Evenement[]>>(`${API_ENDPOINTS.EVENEMENTS}/a-venir`, params);
    return response.data!;
  },

  async search(params: SearchEvenementsParams): Promise<Evenement[]> {
    const response = await apiClient.get<ApiResponse<Evenement[]>>(`${API_ENDPOINTS.EVENEMENTS}/search`, params);
    return response.data!;
  },

  async getParticipants(id: number): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(`${API_ENDPOINTS.EVENEMENTS}/${id}/participants`);
    return response.data!;
  },
};

// =============================================================================
// SERVICE DES LIEUX
// =============================================================================

export const lieuService = {
  async getAll(filters: LieuFilters & PaginationParams): Promise<PaginatedResponse<Lieu>> {
    return apiClient.get<PaginatedResponse<Lieu>>(API_ENDPOINTS.LIEUX, filters);
  },

  async getById(id: number): Promise<Lieu> {
    const response = await apiClient.get<ApiResponse<Lieu>>(`${API_ENDPOINTS.LIEUX}/${id}`);
    return response.data!;
  },

  async create(data: CreateLieuData): Promise<Lieu> {
    const response = await apiClient.post<ApiResponse<Lieu>>(API_ENDPOINTS.LIEUX, data);
    return response.data!;
  },

  async update(id: number, data: Partial<CreateLieuData>): Promise<Lieu> {
    const response = await apiClient.put<ApiResponse<Lieu>>(`${API_ENDPOINTS.LIEUX}/${id}`, data);
    return response.data!;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.LIEUX}/${id}`);
  },

  async getProximite(params: ProximiteFilters): Promise<Lieu[]> {
    const response = await apiClient.get<ApiResponse<Lieu[]>>(`${API_ENDPOINTS.LIEUX}/proximite`, params);
    return response.data!;
  },

  async getStatistiques(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.LIEUX}/statistiques`);
    return response.data!;
  },
};

// =============================================================================
// SERVICE DU PATRIMOINE
// =============================================================================

export const patrimoineService = {
  async getAll(filters: PatrimoineSearchParams & PaginationParams): Promise<PaginatedResponse<Lieu>> {
    return apiClient.get<PaginatedResponse<Lieu>>(`${API_ENDPOINTS.LIEUX}/patrimoine`, filters);
  },

  async getById(id: number): Promise<Lieu> {
    const response = await apiClient.get<ApiResponse<Lieu>>(`${API_ENDPOINTS.LIEUX}/patrimoine/${id}`);
    return response.data!;
  },

  async getMonumentsByType(type: string, params: any = {}): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.LIEUX}/patrimoine/monuments/${type}`, params);
    return response.data!;
  },

  async getVestigesByType(type: string, params: any = {}): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.LIEUX}/patrimoine/vestiges/${type}`, params);
    return response.data!;
  },

  async getPopulaires(params: { limit?: number } = {}): Promise<Lieu[]> {
    const response = await apiClient.get<ApiResponse<Lieu[]>>(`${API_ENDPOINTS.LIEUX}/patrimoine/populaires`, params);
    return response.data!;
  },

  async getStatistiques(): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.LIEUX}/patrimoine/statistiques`);
    return response.data!;
  },

  async recherche(params: PatrimoineSearchParams): Promise<Lieu[]> {
    const response = await apiClient.get<ApiResponse<Lieu[]>>(`${API_ENDPOINTS.LIEUX}/patrimoine/recherche`, params);
    return response.data!;
  },
};

// =============================================================================
// SERVICE DES COMMENTAIRES
// =============================================================================

export const commentaireService = {
  async getByOeuvre(oeuvreId: number, filters: CommentaireFilters & PaginationParams = {}): Promise<PaginatedResponse<Commentaire>> {
    return apiClient.get<PaginatedResponse<Commentaire>>(`${API_ENDPOINTS.OEUVRES}/${oeuvreId}/commentaires`, filters);
  },

  async getByEvenement(evenementId: number, filters: CommentaireFilters & PaginationParams = {}): Promise<PaginatedResponse<Commentaire>> {
    return apiClient.get<PaginatedResponse<Commentaire>>(`${API_ENDPOINTS.EVENEMENTS}/${evenementId}/commentaires`, filters);
  },

  async create(data: CreateCommentaireData): Promise<Commentaire> {
    const endpoint = data.id_oeuvre 
      ? `${API_ENDPOINTS.OEUVRES}/${data.id_oeuvre}/commentaires`
      : `${API_ENDPOINTS.EVENEMENTS}/${data.id_evenement}/commentaires`;
    
    const response = await apiClient.post<ApiResponse<Commentaire>>(endpoint, data);
    return response.data!;
  },

  async update(id: number, data: { contenu?: string; note_qualite?: number }): Promise<Commentaire> {
    const response = await apiClient.put<ApiResponse<Commentaire>>(`${API_ENDPOINTS.COMMENTAIRES}/${id}`, data);
    return response.data!;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_ENDPOINTS.COMMENTAIRES}/${id}`);
  },

  async moderate(id: number, statut: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_ENDPOINTS.COMMENTAIRES}/${id}/moderate`, { statut });
  },
};

// =============================================================================
// SERVICE DES UTILISATEURS
// =============================================================================

export const userService = {
  async getAll(filters: any = {}): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, filters);
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data!;
  },

  async getPendingProfessionals(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(`${API_ENDPOINTS.USERS}/pending-professionals`);
    return response.data!;
  },

  async validateProfessional(id: number, data: { valide: boolean; raison_rejet?: string }): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_ENDPOINTS.USERS}/${id}/validate`, data);
  },
};

// =============================================================================
// SERVICE DES MÉTADONNÉES
// =============================================================================

export const metadataService = {
  async getLangues(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/langues`);
    return response.data!;
  },

  async getCategories(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/categories`);
    return response.data!;
  },

  async getGenres(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/genres`);
    return response.data!;
  },

  async getTypesOeuvres(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/types-oeuvres`);
    return response.data!;
  },

  async getTypesEvenements(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/types-evenements`);
    return response.data!;
  },

  async getWilayas(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/wilayas`);
    return response.data!;
  },

  async getDairas(wilayaId: number): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/wilayas/${wilayaId}/dairas`);
    return response.data!;
  },

  async getCommunes(dairaId: number): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/dairas/${dairaId}/communes`);
    return response.data!;
  },

  async getMateriaux(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/materiaux`);
    return response.data!;
  },

  async getTechniques(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(`${API_ENDPOINTS.METADATA}/techniques`);
    return response.data!;
  },
};

// =============================================================================
// SERVICE D'UPLOAD DE FICHIERS
// =============================================================================

export const uploadService = {
  async uploadFile(file: File, type: 'image' | 'document' | 'video' = 'image'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = tokenStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload');
    }

    const data = await response.json();
    return data.data.url;
  },

  async uploadMultiple(files: File[], type: 'image' | 'document' | 'video' = 'image'): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);

    const token = tokenStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload');
    }

    const data = await response.json();
    return data.data.urls;
  },
};
