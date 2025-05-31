// services/oeuvreService.ts

import { ApiService, ApiResponse, PaginatedResponse } from './apiService';
import { OeuvreType, StatutOeuvreEnum } from '../types/oeuvreType';
import { CritiqueEvaluationType } from '../types/critiqueEvaluationType';

export interface OeuvreFilters {
  titre?: string;
  type_oeuvre?: number;
  langue?: number;
  annee_creation_from?: number;
  annee_creation_to?: number;
  statut?: StatutOeuvreEnum;
  auteur_id?: number;
  editeur_id?: number;
  saisi_par?: number;
  tags?: string[];
  categories?: number[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface OeuvreCreateData {
  titre: string;
  id_type_oeuvre: number;
  id_langue: number;
  annee_creation?: number;
  description?: string;
  id_oeuvre_originale?: number;
  auteurs: OeuvreAuteurData[];
  editeurs?: OeuvreEditeurData[];
  categories?: number[];
  tags?: string[];
  // Données spécifiques selon le type
  livre?: LivreData;
  film?: FilmData;
  albumMusical?: AlbumMusicalData;
  artisanat?: ArtisanatData;
  article?: ArticleData;
  articleScientifique?: ArticleScientifiqueData;
}

export interface OeuvreUpdateData {
  titre?: string;
  id_type_oeuvre?: number;
  id_langue?: number;
  annee_creation?: number;
  description?: string;
  id_oeuvre_originale?: number;
}

export interface OeuvreAuteurData {
  id_auteur?: number;
  nom: string;
  prenom?: string;
  role_auteur: string;
  ordre_auteur?: number;
}

export interface OeuvreEditeurData {
  id_editeur: number;
  role_editeur: string;
  date_edition?: Date;
  isbn?: string;
  prix?: number;
  nb_exemplaires?: number;
}

export interface LivreData {
  isbn?: string;
  nb_pages?: number;
  id_genre?: number;
}

export interface FilmData {
  duree_minutes?: number;
  id_genre?: number;
  realisateur?: string;
}

export interface AlbumMusicalData {
  id_genre: number;
  duree?: number;
  label: string;
}

export interface ArtisanatData {
  id_materiau?: number;
  id_technique?: number;
  dimensions?: string;
  poids?: number;
  prix?: number;
  date_creation?: Date;
}

export interface ArticleData {
  auteur?: string;
  source?: string;
  type_article: string;
  categorie?: string;
  sous_titre?: string;
  date_publication?: Date;
  resume?: string;
  contenu_complet?: string;
  url_source?: string;
}

export interface ArticleScientifiqueData {
  journal?: string;
  doi?: string;
  pages?: string;
  volume?: string;
  numero?: string;
  date_publication?: Date;
  resume?: string;
}

export interface OeuvreStats {
  totalOeuvres: number;
  oeuvresByStatut: Record<StatutOeuvreEnum, number>;
  oeuvresByType: Record<string, number>;
  oeuvresByLangue: Record<string, number>;
  recentOeuvres: OeuvreType[];
  popularOeuvres: OeuvreType[];
  pendingValidation: number;
}

export class OeuvreService {
  private static instance: OeuvreService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): OeuvreService {
    if (!OeuvreService.instance) {
      OeuvreService.instance = new OeuvreService();
    }
    return OeuvreService.instance;
  }

  // CREATE - Créer une œuvre
  async createOeuvre(data: OeuvreCreateData): Promise<ApiResponse<OeuvreType>> {
    const validationError = this.validateOeuvreData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.post<OeuvreType>('/oeuvres', data);
  }

  // READ - Récupérer toutes les œuvres avec filtres
  async getAllOeuvres(filters?: OeuvreFilters): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>('/oeuvres', filters);
  }

  // READ - Récupérer une œuvre par ID
  async getOeuvreById(id: number): Promise<ApiResponse<OeuvreType>> {
    return this.apiService.get<OeuvreType>(`/oeuvres/${id}`);
  }

  // READ - Récupérer les œuvres d'un utilisateur
  async getOeuvresByUser(userId: number, filters?: Omit<OeuvreFilters, 'saisi_par'>): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>(`/users/${userId}/oeuvres`, filters);
  }

  // READ - Récupérer les œuvres d'un auteur
  async getOeuvresByAuteur(auteurId: number, filters?: Omit<OeuvreFilters, 'auteur_id'>): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>(`/auteurs/${auteurId}/oeuvres`, filters);
  }

  // READ - Récupérer les œuvres d'un éditeur
  async getOeuvresByEditeur(editeurId: number, filters?: Omit<OeuvreFilters, 'editeur_id'>): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>(`/editeurs/${editeurId}/oeuvres`, filters);
  }

  // READ - Récupérer les œuvres publiées
  async getPublishedOeuvres(filters?: OeuvreFilters): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>('/oeuvres/published', filters);
  }

  // READ - Récupérer les œuvres en attente de validation
  async getPendingOeuvres(filters?: OeuvreFilters): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>('/oeuvres/pending', filters);
  }

  // READ - Récupérer les œuvres populaires
  async getPopularOeuvres(limit: number = 10): Promise<ApiResponse<OeuvreType[]>> {
    return this.apiService.get<OeuvreType[]>('/oeuvres/popular', { limit });
  }

  // READ - Récupérer les œuvres récentes
  async getRecentOeuvres(limit: number = 10): Promise<ApiResponse<OeuvreType[]>> {
    return this.apiService.get<OeuvreType[]>('/oeuvres/recent', { limit });
  }

  // READ - Récupérer les critiques d'une œuvre
  async getOeuvreCritiques(oeuvreId: number): Promise<ApiResponse<CritiqueEvaluationType[]>> {
    return this.apiService.get<CritiqueEvaluationType[]>(`/oeuvres/${oeuvreId}/critiques`);
  }

  // UPDATE - Mettre à jour une œuvre
  async updateOeuvre(id: number, data: OeuvreUpdateData): Promise<ApiResponse<OeuvreType>> {
    const validationError = this.validateOeuvreUpdateData(data);
    if (validationError) {
      return {
        success: false,
        error: validationError
      };
    }

    return this.apiService.put<OeuvreType>(`/oeuvres/${id}`, data);
  }

  // UPDATE - Soumettre une œuvre pour validation
  async submitForValidation(id: number): Promise<ApiResponse<OeuvreType>> {
    return this.apiService.patch<OeuvreType>(`/oeuvres/${id}/submit`, {});
  }

  // UPDATE - Valider une œuvre (admin)
  async validateOeuvre(id: number): Promise<ApiResponse<OeuvreType>> {
    return this.apiService.patch<OeuvreType>(`/oeuvres/${id}/validate`, {});
  }

  // UPDATE - Rejeter une œuvre (admin)
  async rejectOeuvre(id: number, reason: string): Promise<ApiResponse<OeuvreType>> {
    return this.apiService.patch<OeuvreType>(`/oeuvres/${id}/reject`, { reason });
  }

  // UPDATE - Archiver une œuvre
  async archiveOeuvre(id: number): Promise<ApiResponse<OeuvreType>> {
    return this.apiService.patch<OeuvreType>(`/oeuvres/${id}/archive`, {});
  }

  // UPDATE - Ajouter une critique à une œuvre
  async addCritique(oeuvreId: number, note?: number, commentaire?: string): Promise<ApiResponse<CritiqueEvaluationType>> {
    return this.apiService.post<CritiqueEvaluationType>(`/oeuvres/${oeuvreId}/critiques`, {
      note,
      commentaire
    });
  }

  // UPDATE - Mettre à jour une critique
  async updateCritique(oeuvreId: number, critiqueId: number, note?: number, commentaire?: string): Promise<ApiResponse<CritiqueEvaluationType>> {
    return this.apiService.put<CritiqueEvaluationType>(`/oeuvres/${oeuvreId}/critiques/${critiqueId}`, {
      note,
      commentaire
    });
  }

  // UPDATE - Ajouter des tags à une œuvre
  async addTags(oeuvreId: number, tags: string[]): Promise<ApiResponse<void>> {
    return this.apiService.post<void>(`/oeuvres/${oeuvreId}/tags`, { tags });
  }

  // UPDATE - Retirer des tags d'une œuvre
// UPDATE - Retirer des tags d'une œuvre
async removeTags(oeuvreId: number, tags: string[]): Promise<ApiResponse<void>> {
  return this.apiService.post<void>(`/oeuvres/${oeuvreId}/tags/remove`, { tags });
}

  // DELETE - Supprimer une œuvre
  async deleteOeuvre(id: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/oeuvres/${id}`);
  }

  // DELETE - Supprimer une critique
  async deleteCritique(oeuvreId: number, critiqueId: number): Promise<ApiResponse<void>> {
    return this.apiService.delete<void>(`/oeuvres/${oeuvreId}/critiques/${critiqueId}`);
  }

  // SEARCH - Rechercher des œuvres
  async searchOeuvres(query: string, filters?: Omit<OeuvreFilters, 'search'>): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>('/oeuvres/search', { 
      search: query, 
      ...filters 
    });
  }

  // SEARCH - Recherche avancée par tags
  async searchByTags(tags: string[], filters?: OeuvreFilters): Promise<ApiResponse<PaginatedResponse<OeuvreType>>> {
    return this.apiService.get<PaginatedResponse<OeuvreType>>('/oeuvres/search/tags', { 
      tags, 
      ...filters 
    });
  }

  // STATS - Récupérer les statistiques des œuvres
  async getOeuvreStats(): Promise<ApiResponse<OeuvreStats>> {
    return this.apiService.get<OeuvreStats>('/oeuvres/stats');
  }

  // HELPER - Vérifier si un utilisateur peut modifier une œuvre
  async canEditOeuvre(oeuvreId: number): Promise<ApiResponse<{ canEdit: boolean; reason?: string }>> {
    return this.apiService.get<{ canEdit: boolean; reason?: string }>(`/oeuvres/${oeuvreId}/can-edit`);
  }

  // HELPER - Vérifier si un utilisateur peut supprimer une œuvre
  async canDeleteOeuvre(oeuvreId: number): Promise<ApiResponse<{ canDelete: boolean; reason?: string }>> {
    return this.apiService.get<{ canDelete: boolean; reason?: string }>(`/oeuvres/${oeuvreId}/can-delete`);
  }

  // HELPER - Obtenir les œuvres recommandées
  async getRecommendedOeuvres(limit: number = 10): Promise<ApiResponse<OeuvreType[]>> {
    return this.apiService.get<OeuvreType[]>('/oeuvres/recommended', { limit });
  }

  // VALIDATION - Valider les données d'œuvre
  private validateOeuvreData(data: OeuvreCreateData): string | null {
    if (!data.titre?.trim()) return 'Le titre est requis';
    if (!data.id_type_oeuvre) return 'Le type d\'œuvre est requis';
    if (!data.id_langue) return 'La langue est requise';
    if (!data.auteurs || data.auteurs.length === 0) return 'Au moins un auteur est requis';

    // Validation des auteurs
    for (const auteur of data.auteurs) {
      if (!auteur.nom?.trim()) return 'Le nom de l\'auteur est requis';
      if (!auteur.role_auteur?.trim()) return 'Le rôle de l\'auteur est requis';
    }

    // Validation spécifique selon le type d'œuvre
    if (data.albumMusical && !data.albumMusical.label?.trim()) {
      return 'Le label est requis pour un album musical';
    }

    if (data.article && !data.article.type_article?.trim()) {
      return 'Le type d\'article est requis';
    }

    return null;
  }

  // VALIDATION - Valider les données de mise à jour d'œuvre
  private validateOeuvreUpdateData(data: OeuvreUpdateData): string | null {
    if (data.titre !== undefined && !data.titre.trim()) {
      return 'Le titre ne peut pas être vide';
    }

    return null;
  }
}