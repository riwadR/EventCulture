// types/critiqueEvaluationType.ts
// Import des autres types nécessaires
import { OeuvreType } from './oeuvreType';
import { UserType } from './userType';
export type CritiqueEvaluationType = {
  id_critique: number;
  id_oeuvre: number;
  id_user: number;
  note?: number; // 0 à 10
  commentaire?: string;
  date_creation: Date;
  date_modification: Date;
  // Relations
  oeuvre?: OeuvreType;
  user?: UserType;
}

export type CommentaireType = {
  id_commentaire: number;
  contenu: string;
  date_creation: Date;
  date_modification: Date;
  id_user?: number;
  // Relations
  user?: UserType;
}

