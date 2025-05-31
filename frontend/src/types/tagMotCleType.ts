// types/tagType.ts
// Import des autres types nécessaires
import { OeuvreType } from './oeuvreType';
export type TagMotCleType = {
  id_tag: number;
  nom: string;
  // Relations
  oeuvres?: OeuvreType[];
}

export type OeuvreTagType = {
  id: number;
  id_oeuvre: number;
  id_tag: number;
  // Relations
  oeuvre?: OeuvreType;
  tagMotCle?: TagMotCleType;
}

export type TagCreateData = {
  nom: string;
}

export type TagUpdateData = {
  nom?: string;
}

export type TagFilters = {
  nom?: string;
  search?: string;
  oeuvre_id?: number;
}

