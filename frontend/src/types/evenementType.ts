// types/evenementType.ts
// Import des autres types nécessaires
import { LieuType } from './lieuType';
import { UserType } from './userType';
import { OeuvreType } from './oeuvreType';
import { OrganisationType } from './organisationType';
import { MediaType } from './mediaType';
export enum StatutParticipationEnum {
  INSCRIT = 'inscrit',
  CONFIRME = 'confirme',
  PRESENT = 'present',
  ABSENT = 'absent',
  ANNULE = 'annule'
}

export type EvenementType = {
  id_evenement: number;
  nom_evenement: string;
  description?: string;
  date_debut?: Date;
  date_fin?: Date;
  contact_email?: string;
  contact_telephone?: string;
  image_url?: string;
  id_lieu: number;
  id_user: number;
  id_type_evenement: number;
  date_creation: Date;
  date_modification: Date;
  // Relations
  lieu?: LieuType;
  organisateur?: UserType;
  typeEvenement?: TypeEvenementType;
  participants?: EvenementUserType[];
  oeuvres?: EvenementOeuvreType[];
  organisations?: EvenementOrganisationType[];
  programmes?: ProgrammeType[];
  medias?: MediaType[];
}

export type TypeEvenementType = {
  id_type_evenement: number;
  nom: string;
  description?: string;
}

export type EvenementUserType = {
  id_EventUser: number;
  id_evenement: number;
  id_user: number;
  role_participation: string;
  date_inscription: Date;
  statut_participation: StatutParticipationEnum;
  notes?: string;
  // Relations
  evenement?: EvenementType;
  user?: UserType;
}

export type EvenementOeuvreType = {
  id_EventOeuvre: number;
  id_evenement: number;
  id_oeuvre: number;
  id_presentateur?: number;
  // Relations
  evenement?: EvenementType;
  oeuvre?: OeuvreType;
  presentateur?: UserType;
}

export type EvenementOrganisationType = {
  id: number;
  id_evenement: number;
  id_organisation: number;
  role?: string;
  date_creation: Date;
  date_modification: Date;
  // Relations
  evenement?: EvenementType;
  organisation?: OrganisationType;
}

export type ProgrammeType = {
  id_programme: number;
  id_evenement: number;
  titre: string;
  description?: string;
  heure_debut?: Date;
  heure_fin?: Date;
  lieu_specifique?: string;
  // Relations
  evenement?: EvenementType;
}

