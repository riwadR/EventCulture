// types/oeuvreConcreteType.ts

// ===============================
// LIVRE
// ===============================
import { OeuvreType } from './oeuvreType';
export type LivreType = {
  id_livre: number;
  id_oeuvre: number;
  isbn?: string;
  nb_pages?: number;
  id_genre?: number;
  // Relations
  oeuvre?: OeuvreType;
  genre?: GenreType;
}

// ===============================
// FILM
// ===============================
export type FilmType = {
  id_film: number;
  id_oeuvre: number;
  duree_minutes?: number;
  id_genre?: number;
  realisateur?: string;
  // Relations
  oeuvre?: OeuvreType;
  genre?: GenreType;
}

// ===============================
// ALBUM MUSICAL
// ===============================
export type AlbumMusicalType = {
  id_album: number;
  id_oeuvre: number;
  id_genre: number;
  duree?: number; // en minutes
  label: string;
  // Relations
  oeuvre?: OeuvreType;
  genre?: GenreType;
}

// ===============================
// ARTICLE
// ===============================
export type ArticleType = {
  id_article: number;
  id_oeuvre: number;
  auteur?: string;
  source?: string;
  type_article: TypeArticleEnum;
  categorie?: string;
  sous_titre?: string;
  date_publication?: Date;
  date_derniere_modification?: Date;
  resume?: string;
  contenu_complet?: string;
  url_source?: string;
  url_archive?: string;
  statut: StatutArticleEnum;
  langue_contenu?: string;
  nb_mots?: number;
  temps_lecture?: number;
  niveau_credibilite: NiveauCredibiliteEnum;
  fact_checked: boolean;
  paywall: boolean;
  nb_vues: number;
  nb_partages: number;
  note_qualite?: number;
  commentaires_moderation?: string;
  date_creation: Date;
  date_modification: Date;
  // Relations
  oeuvre?: OeuvreType;
}

export enum TypeArticleEnum {
  PRESSE = 'presse',
  BLOG = 'blog',
  MAGAZINE = 'magazine',
  NEWSLETTER = 'newsletter',
  COMMUNIQUE = 'communique',
  EDITORIAL = 'editorial',
  INTERVIEW = 'interview',
  REPORTAGE = 'reportage',
  AUTRE = 'autre'
}

export enum StatutArticleEnum {
  BROUILLON = 'brouillon',
  PUBLIE = 'publie',
  ARCHIVE = 'archive',
  SUPPRIME = 'supprime'
}

export enum NiveauCredibiliteEnum {
  TRES_FIABLE = 'tres_fiable',
  FIABLE = 'fiable',
  MOYEN = 'moyen',
  PEU_FIABLE = 'peu_fiable',
  NON_VERIFIE = 'non_verifie'
}

// ===============================
// ARTICLE SCIENTIFIQUE
// ===============================
export type ArticleScientifiqueType = {
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
  date_soumission?: Date;
  date_acceptation?: Date;
  date_publication?: Date;
  resume?: string;
  citation_apa?: string;
  url_hal?: string;
  url_arxiv?: string;
  // Relations
  oeuvre?: OeuvreType;
}

// ===============================
// ARTISANAT
// ===============================
export type ArtisanatType = {
  id_artisanat: number;
  id_oeuvre: number;
  id_materiau?: number;
  id_technique?: number;
  dimensions?: string;
  poids?: number;
  prix?: number;
  date_creation?: Date;
  // Relations
  oeuvre?: OeuvreType;
  materiau?: MateriauType;
  technique?: TechniqueType;
}

// ===============================
// OEUVRE D'ART
// ===============================
export type OeuvreArtType = {
  id_oeuvre_art: number;
  id_oeuvre: number;
  technique?: string;
  dimensions?: string;
  support?: string;
  // Relations
  oeuvre?: OeuvreType;
}

// ===============================
// MATÉRIAU
// ===============================
export type MateriauType = {
  id_materiau: number;
  nom: string;
  description?: string;
  // Relations
  artisanats?: ArtisanatType[];
}

// ===============================
// TECHNIQUE
// ===============================
export type TechniqueType = {
  id_technique: number;
  nom: string;
  description?: string;
  // Relations
  artisanats?: ArtisanatType[];
}

// ===============================
// GENRE
// ===============================
export type GenreType = {
  id_genre: number;
  nom: string;
  // Relations
  livres?: LivreType[];
  films?: FilmType[];
  albumsMusicaux?: AlbumMusicalType[];
}

// Import des autres types nécessaires
