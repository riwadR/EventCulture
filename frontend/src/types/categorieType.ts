// types/categorieType.ts
// Import des autres types nécessaires
import { OeuvreType } from './oeuvreType';
export type CategorieType = {
  id_categorie: number;
  nom: string;
  // Relations
  oeuvres?: OeuvreType[];
}

export type OeuvreCategorieType = {
  id_categorie: number;
  id_oeuvre: number;
  // Relations
  categorie?: CategorieType;
  oeuvre?: OeuvreType;
}

export type CategorieCreateData = {
  nom: string;
}

export type CategorieUpdateData = {
  nom?: string;
}

export type CategorieFilters = {
  nom?: string;
  search?: string;
}

