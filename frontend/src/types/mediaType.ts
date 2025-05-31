// types/mediaType.ts
import { OeuvreType } from './oeuvreType';
import { EvenementType } from './evenementType';
export type MediaType = {
  id_media: number;
  id_oeuvre?: number;
  id_evenement?: number;
  type_media: string;
  url: string;
  description?: string;
  // Relations
  oeuvre?: OeuvreType;
  evenement?: EvenementType;
}

export type CategorieType = {
  id_categorie: number;
  nom: string;
  // Relations
  oeuvres?: OeuvreCategorieType[];
}

export type OeuvreCategorieType = {
  id_OeuvreCategorie: number;
  id_oeuvre: number;
  id_categorie: number;
  // Relations
  oeuvre?: OeuvreType;
  categorie?: CategorieType;
}

export type TagMotCleType = {
  id_tag: number;
  nom: string;
  description?: string;
  // Relations
  oeuvres?: OeuvreTagType[];
}

export type OeuvreTagType = {
  id_OeuvreTag: number;
  id_oeuvre: number;
  id_tag: number;
  // Relations
  oeuvre?: OeuvreType;
  tag?: TagMotCleType;
}

// Import des autres types nécessaires
