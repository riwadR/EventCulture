// types/parcoursType.ts
// Import des autres types nécessaires
import { LieuType } from './lieuType';
import { EvenementType } from './evenementType';
import { ProgrammeType } from './programmeType';
export type ParcoursType = {
  id_parcours: number;
  nom: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  parcoursLieux?: ParcoursLieuxType[];
  programmes?: ProgrammeType[];
}

export type ParcoursLieuxType = {
  id_parcours_lieu: number;
  id_parcours: number;
  id_lieu: number;
  id_evenement?: number;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  parcours?: ParcoursType;
  lieu?: LieuType;
  evenement?: EvenementType;
}

