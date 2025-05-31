// types/organisationType.ts

export enum TypeOrganisationEnum {
  ASSOCIATION = 'association',
  ENTREPRISE = 'entreprise',
  INSTITUTION = 'institution',
  COLLECTIVITE = 'collectivite',
  ONG = 'ong',
  FONDATION = 'fondation',
  COOPERATIVE = 'cooperative',
  SYNDICAT = 'syndicat',
  AUTRE = 'autre'
}

export type OrganisationType = {
  id_organisation: number;
  nom: string;
  type_organisation: TypeOrganisationEnum;
  description?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  logo_url?: string;
  date_creation: Date;
  date_modification: Date;
  actif: boolean;
  // Relations
  evenements?: EvenementType[];
  membres?: UserType[];
  evenementOrganisations?: EvenementOrganisationType[];
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

// Import des autres types nécessaires
import { EvenementType } from './evenementType';
import { UserType } from './userType';ite',
  ONG = 'ong',
  FONDATION = 'fondation',
  COOPERATIVE = 'cooperative',
  SYNDICAT = 'syndicat',
  AUTRE = 'autre'
}

export type OrganisationType = {
  id_organisation: number;
  nom: string;
  type_organisation: TypeOrganisationEnum;
  description?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  logo_url?: string;
  date_creation: Date;
  date_modification: Date;
  actif: boolean;
  // Relations
  evenements?: EvenementType[];
  membres?: UserType[];
}

// Import des autres types nécessaires
import { EvenementType } from './evenementType';
import { UserType } from './userType';