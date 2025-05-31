// types/user.type.ts

export enum UserTypeEnum {
  ECRIVAIN = 'ecrivain',
  JOURNALISTE = 'journaliste',
  SCIENTIFIQUE = 'scientifique',
  ACTEUR = 'acteur',
  ARTISTE = 'artiste',
  ARTISAN = 'artisan',
  REALISATEUR = 'realisateur',
  MUSICIEN = 'musicien',
  PHOTOGRAPHE = 'photographe',
  DANSEUR = 'danseur',
  SCULPTEUR = 'sculpteur',
  VISITEUR = 'visiteur'
}

export enum RoleEnum {
  USER = 'user',
  PROFESSIONNEL = 'professionnel',
  ADMIN = 'admin'
}

export type UserType = {
  id_user: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  type_user: UserTypeEnum;
  role: RoleEnum;
  biographie?: string;
  photo_url?: string;
  telephone?: string;
  date_naissance?: Date;
  date_creation: Date;
  date_modification: Date;
  organisation?: OrganisationType;
  roles?: RoleType[];
}

export type RoleType = {
  id_role: number;
  nom: string;
  description?: string;
  permissions?: string[];
}

// Import des autres types nécessaires
import { OrganisationType } from "./organisationType";