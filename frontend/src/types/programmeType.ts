// types/programmeType.ts
// Import des autres types nécessaires
import { EvenementType } from './evenementType';
import { LieuType } from './lieuType';
import { UserType } from './userType';
import { ParcoursType } from './parcoursType';
export enum StatutProgrammeEnum {
  PLANIFIE = 'planifie',
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  ANNULE = 'annule',
  REPORTE = 'reporte'
}

export enum TypeActiviteEnum {
  CONFERENCE = 'conference',
  ATELIER = 'atelier',
  SPECTACLE = 'spectacle',
  EXPOSITION = 'exposition',
  VISITE = 'visite',
  DEGUSTATION = 'degustation',
  PROJECTION = 'projection',
  CONCERT = 'concert',
  LECTURE = 'lecture',
  DEBAT = 'debat',
  FORMATION = 'formation',
  CEREMONIE = 'ceremonie',
  AUTRE = 'autre'
}

export type ProgrammeType = {
  id_programme: number;
  id_evenement: number;
  id_lieu?: number;
  titre: string;
  description?: string;
  heure_debut?: Date;
  heure_fin?: Date;
  lieu_specifique?: string;
  ordre?: number;
  statut?: StatutProgrammeEnum;
  type_activite?: TypeActiviteEnum;
  duree_estimee?: number; // en minutes
  nb_participants_max?: number;
  materiel_requis?: string;
  notes_organisateur?: string;
  date_creation: Date;
  date_modification: Date;
  // Relations
  evenement?: EvenementType;
  lieu?: LieuType;
  parcours?: ParcoursType[];
  intervenants?: UserType[];
}

export type ProgrammeParcoursType = {
  id_programme: number;
  id_parcours: number;
  // Relations
  programme?: ProgrammeType;
  parcours?: ParcoursType;
}

export type ProgrammeIntervenantType = {
  id_programme: number;
  id_user: number;
  // Relations
  programme?: ProgrammeType;
  intervenant?: UserType;
}

