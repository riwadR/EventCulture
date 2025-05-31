// types/auteurType.ts

export type AuteurType = {
  id_auteur: number;
  nom: string;
  prenom?: string;
  pseudonyme?: string;
  biographie?: string;
  date_naissance?: Date;
  date_deces?: Date;
  nationalite?: string;
  lieu_naissance?: string;
  photo_url?: string;
  site_web?: string;
  reseaux_sociaux?: string;
  date_creation: Date;
  date_modification: Date;
  // Relations
  oeuvres?: OeuvreAuteurType[];
}

export type OeuvreAuteurType = {
  id_OeuvreAuteur: number;
  id_oeuvre: number;
  id_auteur: number;
  role_auteur: string;
  ordre_auteur?: number;
  // Relations
  oeuvre?: OeuvreType;
  auteur?: AuteurType;
}

// Import des autres types nécessaires
import { OeuvreType } from './oeuvreType';