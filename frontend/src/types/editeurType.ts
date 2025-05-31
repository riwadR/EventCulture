// types/editeurType.ts
import { OeuvreType } from './oeuvreType';
export enum TypeEditeurEnum {
  MAISON_EDITION = 'maison_edition',
  LABEL_MUSIQUE = 'label_musique',
  STUDIO_CINEMA = 'studio_cinema',
  GALERIE_ART = 'galerie_art',
  EDITEUR_SCIENTIFIQUE = 'editeur_scientifique',
  PRESSE = 'presse',
  EDITEUR_NUMERIQUE = 'editeur_numerique',
  AUTRE = 'autre'
}

export enum RoleEditeurEnum {
  EDITEUR_PRINCIPAL = 'editeur_principal',
  CO_EDITEUR = 'co_editeur',
  DISTRIBUTEUR = 'distributeur',
  EDITEUR_ORIGINAL = 'editeur_original',
  EDITEUR_TRADUCTION = 'editeur_traduction',
  EDITEUR_NUMERIQUE = 'editeur_numerique',
  REEDITION = 'reedition',
  AUTRE = 'autre'
}

export enum StatutEditionEnum {
  EN_COURS = 'en_cours',
  PUBLIE = 'publie',
  EPUISE = 'epuise',
  ANNULE = 'annule'
}

export type EditeurType = {
  id_editeur: number;
  nom: string;
  type_editeur: TypeEditeurEnum;
  pays?: string;
  ville?: string;
  adresse?: string;
  site_web?: string;
  email?: string;
  telephone?: string;
  description?: string;
  annee_creation?: number;
  actif: boolean;
  date_creation: Date;
  date_modification: Date;
  // Relations
  oeuvres?: OeuvreEditeurType[];
}

export type OeuvreEditeurType = {
  id_OeuvreEditeur: number;
  id_oeuvre: number;
  id_editeur: number;
  role_editeur: RoleEditeurEnum;
  date_edition?: Date;
  isbn?: string;
  prix?: number;
  nb_exemplaires?: number;
  statut_edition: StatutEditionEnum;
  notes?: string;
  // Relations
  oeuvre?: OeuvreType;
  editeur?: EditeurType;
}

// Import des autres types nécessaires
