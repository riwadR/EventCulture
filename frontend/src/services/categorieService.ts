// services/categorieService.ts

import { ApiService } from './apiService';
import { 
  CategorieType, 
  CategorieCreateData, 
  CategorieUpdateData, 
  CategorieFilters,
  OeuvreCategorieType
} from '../types/categorieType';
import { ApiResponse, PaginatedResponse } from '../types/apiType';

export class CategorieService {
  private static instance: CategorieService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): CategorieService {
    if (!CategorieService.instance) {
      CategorieService.instance = new CategorieService();
    }
    return CategorieService.instance;
  }

  // ===============================
  // CRUD CATÉGORIES
  // ===============================

  // Récupérer toutes les catégories avec pagination
  async getAllCategories(filters?: CategorieFilters): Promise<ApiResponse<PaginatedResponse<CategorieType>>> {
    const params = this.buildQueryParams(filters);
    return this.apiService.get<PaginatedResponse<CategorieType>>(`/categories${params}`);
  }

  // Récupérer toutes les catégories sans pagination
  async getCategories(): Promise<ApiResponse<CategorieType[]>> {
    return this.apiService.get<CategorieType[]>('/categories/all');
  }

  // Récupérer une catégorie par ID
  async getCategorieById(id: number): Promise<ApiResponse<CategorieType>> {
    return this.apiService.get<CategorieType>(`/categories/${id}`);
  }

  // Créer une nouvelle catégorie
  async createCategorie(data: CategorieCreateData): Promise<ApiResponse<CategorieType>> {
    return this.apiService.post<CategorieType>('/categories', data);
  }

  // Mettre à jour une catégorie
  async updateCategorie(id: number, data: CategorieUpdateData): Promise<ApiResponse<CategorieType>> {
    return this.apiService.put<CategorieType>(`/categories/${id}`, data);
  }

  // Supprimer une catégorie
  async deleteCategorie(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/categories/${id}`);
  }

  // ===============================
  // GESTION DES ASSOCIATIONS ŒUVRE-CATÉGORIE
  // ===============================

  // Récupérer les œuvres d'une catégorie
  async getOeuvresByCategorie(categorieId: number, filters?: any): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = this.buildQueryParams(filters);
    return this.apiService.get<PaginatedResponse<any>>(`/categories/${categorieId}/oeuvres${params}`);
  }

  // Récupérer les catégories d'une œuvre
  async getCategoriesByOeuvre(oeuvreId: number): Promise<ApiResponse<CategorieType[]>> {
    return this.apiService.get<CategorieType[]>(`/oeuvres/${oeuvreId}/categories`);
  }

  // Associer une œuvre à une catégorie
  async addOeuvreToCategorie(oeuvreId: number, categorieId: number): Promise<ApiResponse<OeuvreCategorieType>> {
    return this.apiService.post<OeuvreCategorieType>('/oeuvre-categories', {
      id_oeuvre: oeuvreId,
      id_categorie: categorieId
    });
  }

  // Dissocier une œuvre d'une catégorie
  async removeOeuvreFromCategorie(oeuvreId: number, categorieId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/oeuvre-categories/${oeuvreId}/${categorieId}`);
  }

  // Mettre à jour les catégories d'une œuvre
  async updateOeuvreCategories(oeuvreId: number, categorieIds: number[]): Promise<ApiResponse<void>> {
    return this.apiService.put<void>(`/oeuvres/${oeuvreId}/categories`, {
      categories: categorieIds
    });
  }

  // ===============================
  // RECHERCHE ET STATISTIQUES
  // ===============================

  // Rechercher des catégories
  async searchCategories(query: string): Promise<ApiResponse<CategorieType[]>> {
    return this.apiService.get<CategorieType[]>(`/categories/search?q=${encodeURIComponent(query)}`);
  }

  // Obtenir les statistiques des catégories
  async getCategoriesStats(): Promise<ApiResponse<any>> {
    return this.apiService.get<any>('/categories/stats');
  }

  // Obtenir les catégories les plus utilisées
  async getPopularCategories(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.apiService.get<any[]>(`/categories/popular?limit=${limit}`);
  }

  // ===============================
  // UTILITAIRES
  // ===============================

  // Construire les paramètres de requête
  private buildQueryParams(filters?: CategorieFilters): string {
    if (!filters) return '';
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    return params.toString() ? `?${params.toString()}` : '';
  }

  // Valider les données d'une catégorie
  private validateCategorieData(data: CategorieCreateData | CategorieUpdateData): string | null {
    if ('nom' in data && data.nom !== undefined) {
      if (!data.nom?.trim()) {
        return 'Le nom de la catégorie est requis';
      }
      if (data.nom.length > 100) {
        return 'Le nom de la catégorie ne peut pas dépasser 100 caractères';
      }
    }
    return null;
  }

  // Créer une catégorie avec validation
  async createCategorieWithValidation(data: CategorieCreateData): Promise<ApiResponse<CategorieType>> {
    const validationError = this.validateCategorieData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError,
        data: null
      };
    }
    return this.createCategorie(data);
  }

  // Mettre à jour une catégorie avec validation
  async updateCategorieWithValidation(id: number, data: CategorieUpdateData): Promise<ApiResponse<CategorieType>> {
    const validationError = this.validateCategorieData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError,
        data: null
      };
    }
    return this.updateCategorie(id, data);
  }
}

export type { CategorieFilters, CategorieCreateData, CategorieUpdateData };