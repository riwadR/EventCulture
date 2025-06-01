// types/oeuvre.ts - Types pour les œuvres culturelles

import type { User, NomRole } from './user';
import type { Langue, Categorie, Genre, TypeOeuvre, TagMotCle, Materiau, Technique } from './classification';
import type { Editeur } from './organisation';
import type { BaseMedia } from './base';

// =============================================================================
// ÉNUMÉRATIONS ŒUVRES
// =============================================================================

export type StatutOeuvre = 
  | 'brouillon' 
  | 'en_attente' 
  | 'publie' 
  | 'rejete' 
  | 'archive' 
  | 'supprime';

export type RoleDansOeuvre = 
  | 'auteur' 
  | 'realisateur' 
  | 'acteur' 
  | 'musicien' 
  | 'artiste' 
  | 'artisan' 
  | 'journaliste' 
  | 'scientifique' 
  | 'collaborateur' 
  | 'autre';

export type TypeArticle = 
  | 'presse'
  | 'blog'
  | 'magazine'
  | 'newsletter'
  | 'communique'
  | 'editorial'
  | 'interview'
  | 'reportage'
  | 'autre';

export type NiveauCredibilite = 
  | 'tres_fiable'
  | 'fiable'
  | 'moyen'
  | 'peu_fiable'
  | 'non_verifie';

// =============================================================================
// INTERFACE PRINCIPALE ŒUVRE
// =============================================================================

export interface Oeuvre {
  id_oeuvre: number;
  titre: string;
  id_type_oeuvre: number;
  id_langue: number;
  annee_creation?: number;
  description?: string;
  saisi_par?: number;
  id_oeuvre_originale?: number;
  statut: StatutOeuvre;
  date_validation?: string;
  validateur_id?: number;
  raison_rejet?: string;
  date_creation: string;
  date_modification: string;
  
  // Relations
  TypeOeuvre?: TypeOeuvre;
  Langue?: Langue;
  Saiseur?: User;
  Validateur?: User;
  Users?: User[];
  Categories?: Categorie[];
  TagMotCles?: TagMotCle[];
  Editeurs?: Editeur[];
  Livre?: Livre;
  Film?: Film;
  AlbumMusical?: AlbumMusical;
  Article?: Article;
  ArticleScientifique?: ArticleScientifique;
  Artisanat?: Artisanat;
  OeuvreArt?: OeuvreArt;
  Medias?: Media[];
  CritiqueEvaluations?: CritiqueEvaluation[];
  
  // Métadonnées calculées
  note_moyenne?: number;
  nombre_critiques?: number;
  nombre_vues?: number;
  popularite_score?: number;
}

// =============================================================================
// RELATION ŒUVRE-UTILISATEUR
// =============================================================================

export interface OeuvreUser {
  id: number;
  id_oeuvre: number;
  id_user: number;
  role_dans_oeuvre: RoleDansOeuvre;
  personnage?: string;
  ordre_apparition?: number;
  role_principal: boolean;
  description_role?: string;
  User?: User;
}

// =============================================================================
// TYPES SPÉCIFIQUES PAR ŒUVRE
// =============================================================================

// LIVRE
export interface Livre {
  id_livre: number;
  id_oeuvre: number;
  isbn?: string;
  nb_pages?: number;
  id_genre?: number;
  editeur_original?: string;
  premiere_edition?: string;
  derniere_edition?: string;
  traduction?: boolean;
  langue_originale?: number;
  Genre?: Genre;
}

// FILM
export interface Film {
  id_film: number;
  id_oeuvre: number;
  duree_minutes?: number;
  realisateur?: string;
  id_genre?: number;
  budget?: number;
  recettes?: number;
  classification?: string; // G, PG, PG-13, R, etc.
  format_original?: string; // 35mm, numérique, etc.
  couleur?: boolean;
  Genre?: Genre;
}

// ALBUM MUSICAL
export interface AlbumMusical {
  id_album: number;
  id_oeuvre: number;
  duree?: number; // en minutes
  id_genre: number;
  label: string;
  nombre_pistes?: number;
  producteur?: string;
  studio_enregistrement?: string;
  format_original?: string; // CD, vinyle, numérique
  Genre?: Genre;
}

// ARTICLE
export interface Article {
  id_article: number;
  id_oeuvre: number;
  auteur?: string;
  source?: string;
  type_article: TypeArticle;
  categorie?: string;
  sous_titre?: string;
  date_publication?: string;
  date_derniere_modification?: string;
  resume?: string;
  contenu_complet?: string;
  url_source?: string;
  url_archive?: string;
  statut: string;
  langue_contenu?: string;
  nb_mots?: number;
  temps_lecture?: number; // en minutes
  niveau_credibilite: NiveauCredibilite;
  fact_checked: boolean;
  paywall: boolean;
  nb_vues: number;
  nb_partages: number;
  note_qualite?: number;
  commentaires_moderation?: string;
}

// ARTICLE SCIENTIFIQUE
export interface ArticleScientifique {
  id_article_scientifique: number;
  id_oeuvre: number;
  journal?: string;
  doi?: string;
  pages?: string;
  volume?: string;
  numero?: string;
  issn?: string;
  impact_factor?: number;
  peer_reviewed: boolean;
  open_access: boolean;
  date_soumission?: string;
  date_acceptation?: string;
  date_publication?: string;
  resume?: string;
  citation_apa?: string;
  citation_mla?: string;
  mots_cles_scientifiques?: string[];
  domaine_recherche?: string;
  url_hal?: string;
  url_arxiv?: string;
  nombre_citations?: number;
}

// ARTISANAT
export interface Artisanat {
  id_artisanat: number;
  id_oeuvre: number;
  id_materiau?: number;
  id_technique?: number;
  dimensions?: string;
  poids?: number; // en grammes
  prix?: number;
  date_creation?: string;
  region_origine?: string;
  tradition_associee?: string;
  niveau_difficulte?: 'facile' | 'moyen' | 'difficile' | 'expert';
  temps_creation?: number; // en heures
  pieces_similaires?: number;
  Materiau?: Materiau;
  Technique?: Technique;
}

// ŒUVRE D'ART
export interface OeuvreArt {
  id_oeuvre_art: number;
  id_oeuvre: number;
  technique?: string;
  dimensions?: string;
  support?: string;
  medium?: string;
  style_artistique?: string;
  periode_artistique?: string;
  lieu_creation?: string;
  inspiration?: string;
  etat_conservation?: 'excellent' | 'bon' | 'moyen' | 'mauvais';
  valeur_estimee?: number;
  propriete_actuelle?: string;
  expositions_precedentes?: string[];
}

// =============================================================================
// MÉDIAS ET ÉVALUATIONS
// =============================================================================

export interface Media extends BaseMedia {
  id_media: number;
  id_oeuvre?: number;
  id_evenement?: number;
  type_media: string;
  titre?: string;
  legende?: string;
  copyright?: string;
  qualite?: 'basse' | 'moyenne' | 'haute' | 'originale';
  taille_fichier?: number;
  format?: string;
  ordre_affichage?: number;
}

export interface CritiqueEvaluation {
  id_critique: number;
  id_oeuvre: number;
  id_user: number;
  note: number; // 1-5 ou 1-10
  commentaire?: string;
  date_creation: string;
  date_modification: string;
  recommande?: boolean;
  critique_professionnelle?: boolean;
  User?: User;
}

// =============================================================================
// TYPES DE FORMULAIRES ET CRÉATION
// =============================================================================

export interface CreateOeuvreData {
  titre: string;
  id_type_oeuvre: number;
  id_langue: number;
  annee_creation?: number;
  description?: string;
  categories?: number[];
  tags?: string[];
  auteurs?: {
    id_user: number;
    role?: RoleDansOeuvre;
    role_principal?: boolean;
    personnage?: string;
    description_role?: string;
  }[];
  details_specifiques?: {
    livre?: Partial<Livre>;
    film?: Partial<Film>;
    album?: Partial<AlbumMusical>;
    article?: Partial<Article>;
    artisanat?: Partial<Artisanat>;
    oeuvre_art?: Partial<OeuvreArt>;
  };
}

export interface UpdateOeuvreData extends Partial<CreateOeuvreData> {
  statut?: StatutOeuvre;
}

// =============================================================================
// TYPES DE FILTRES ET RECHERCHE
// =============================================================================

export interface OeuvreFilters {
  type?: number;
  langue?: number;
  statut?: StatutOeuvre;
  annee_min?: number;
  annee_max?: number;
  auteur?: number;
  categorie?: number;
  genre?: number;
  tags?: string[];
  note_min?: number;
  search?: string;
  wilaya?: number; // pour filtrer par région de l'auteur
  professionnel_valide?: boolean;
}

export interface SearchOeuvresParams extends OeuvreFilters {
  q?: string; // recherche générale
  sort?: 'date' | 'titre' | 'note' | 'popularite' | 'pertinence';
  order?: 'ASC' | 'DESC';
  limit?: number;
}

// =============================================================================
// TYPES DE VALIDATION ET MODÉRATION
// =============================================================================

export interface ValidationOeuvreData {
  statut: 'publie' | 'rejete';
  raison_rejet?: string;
  commentaires_validation?: string;
}

// =============================================================================
// CONSTANTES ET UTILITAIRES
// =============================================================================

export const STATUTS_OEUVRE_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon', color: 'gray' },
  { value: 'en_attente', label: 'En attente', color: 'orange' },
  { value: 'publie', label: 'Publié', color: 'green' },
  { value: 'rejete', label: 'Rejeté', color: 'red' },
  { value: 'archive', label: 'Archivé', color: 'blue' },
] as const;

export const ROLES_OEUVRE_OPTIONS = [
  { value: 'auteur', label: 'Auteur' },
  { value: 'realisateur', label: 'Réalisateur' },
  { value: 'acteur', label: 'Acteur' },
  { value: 'musicien', label: 'Musicien' },
  { value: 'artiste', label: 'Artiste' },
  { value: 'artisan', label: 'Artisan' },
  { value: 'journaliste', label: 'Journaliste' },
  { value: 'scientifique', label: 'Scientifique' },
  { value: 'collaborateur', label: 'Collaborateur' },
  { value: 'autre', label: 'Autre' },
] as const;

// Utilitaires
export const getOeuvreTypeLabel = (oeuvre: Oeuvre): string => {
  return oeuvre.TypeOeuvre?.nom_type || 'Type inconnu';
};

export const getOeuvreStatutColor = (statut: StatutOeuvre): string => {
  const statusOption = STATUTS_OEUVRE_OPTIONS.find(opt => opt.value === statut);
  return statusOption?.color || 'gray';
};

export const isOeuvrePublished = (oeuvre: Oeuvre): boolean => {
  return oeuvre.statut === 'publie';
};

export const canUserEditOeuvre = (oeuvre: Oeuvre, user: User): boolean => {
  return oeuvre.saisi_par === user.id_user || 
         user.Roles?.some((r) => r.nom_role === 'Admin') || 
         false;
};