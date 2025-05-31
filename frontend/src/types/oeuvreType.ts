
// types/oeuvreType.ts
import { UserType } from './userType';
import { AuteurType } from './auteurType';
import { EditeurType } from './editeurType';
import { MediaType } from './mediaType';
import { CritiqueEvaluationType } from './critiqueEvaluationType';
import { EvenementType } from './evenementType';
import { CategorieType } from './categorieType';
import { TagMotCleType } from './tagMotCleType';
export enum StatutOeuvreEnum {
  BROUILLON = 'brouillon',
  EN_ATTENTE = 'en_attente',
  PUBLIE = 'publie',
  REJETE = 'rejete',
  ARCHIVE = 'archive',
  SUPPRIME = 'supprime'
}

export type OeuvreType = {
  id_oeuvre: number;
  titre: string;
  id_type_oeuvre: number;
  id_langue: number;
  annee_creation?: number;
  description?: string;
  saisi_par?: number;
  id_oeuvre_originale?: number;
  statut: StatutOeuvreEnum;
  date_validation?: Date;
  validateur_id?: number;
  raison_rejet?: string;
  date_creation: Date;
  date_modification: Date;
  // Relations
  typeOeuvre?: TypeOeuvreType;
  langue?: LangueType;
  saisieParUser?: UserType;
  oeuvreOriginale?: OeuvreType;
  validateur?: UserType;
  auteurs?: AuteurType[];
  editeurs?: EditeurType[];
  medias?: MediaType[];
  critiques?: CritiqueEvaluationType[];
  evenements?: EvenementType[];
  categories?: CategorieType[];
  tags?: TagMotCleType[];
}

export type TypeOeuvreType = {
  id_type_oeuvre: number;
  nom: string;
  description?: string;
}

export type LangueType = {
  id_langue: number;
  nom: string;
  code?: string;
}

export type GenreType = {
  id_genre: number;
  nom: string;
}

// Import des autres types nécessaires


