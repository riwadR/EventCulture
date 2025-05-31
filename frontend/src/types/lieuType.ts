// types/lieuType.ts
import { EvenementType } from './evenementType';
export enum TypeLieuEnum {
  WILAYA = 'Wilaya',
  DAIRA = 'Daira',
  COMMUNE = 'Commune'
}

export enum TypeMonumentEnum {
  MOSQUEE = 'Mosquée',
  PALAIS = 'Palais',
  STATUE = 'Statue',
  TOUR = 'Tour',
  MUSEE = 'Musée'
}

export enum TypeVestigeEnum {
  RUINES = 'Ruines',
  MURAILLES = 'Murailles',
  SITE_ARCHEOLOGIQUE = 'Site archéologique'
}

export type LieuType = {
  id_lieu: number;
  typeLieu: TypeLieuEnum;
  wilayaId?: number;
  dairaId?: number;
  communeId?: number;
  localiteId?: number;
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  wilaya?: WilayaType;
  daira?: DairaType;
  commune?: CommuneType;
  localite?: LocaliteType;
  detailLieu?: DetailLieuType;
  medias?: LieuMediaType[];
  services?: ServiceType[];
  evenements?: EvenementType[];
}

export type WilayaType = {
  id_wilaya: number;
  nom: string;
  wilaya_name_ascii: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  dairas?: DairaType[];
  lieux?: LieuType[];
}

export type DairaType = {
  id_daira: number;
  nom: string;
  daira_name_ascii: string;
  wilayaId: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  wilaya?: WilayaType;
  communes?: CommuneType[];
  lieux?: LieuType[];
}

export type CommuneType = {
  id_commune: number;
  nom: string;
  commune_name_ascii: string;
  dairaId: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  daira?: DairaType;
  localites?: LocaliteType[];
  lieux?: LieuType[];
}

export type LocaliteType = {
  id_localite: number;
  nom: string;
  localite_name_ascii: string;
  id_commune: number;
  // Relations
  commune?: CommuneType;
  lieux?: LieuType[];
}

export type DetailLieuType = {
  id_detailLieu: number;
  description?: string;
  horaires?: string;
  histoire?: string;
  id_lieu: number;
  referencesHistoriques?: string;
  noteMoyenne?: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  lieu?: LieuType;
  monuments?: MonumentType[];
  vestiges?: VestigeType[];
}

export type MonumentType = {
  id: number;
  detailLieuId: number;
  nom: string;
  description: string;
  type: TypeMonumentEnum;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  detailLieu?: DetailLieuType;
}

export type VestigeType = {
  id: number;
  detailLieuId: number;
  nom: string;
  description: string;
  type: TypeVestigeEnum;
  periode_historique?: string;
  etat_conservation?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  detailLieu?: DetailLieuType;
}

export type LieuMediaType = {
  id: number;
  id_lieu: number;
  type: string;
  url: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  lieu?: LieuType;
}

export type ServiceType = {
  id: number;
  id_lieu: number;
  nom: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  lieu?: LieuType;
}

// Import des autres types nécessaires
