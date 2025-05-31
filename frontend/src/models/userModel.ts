// models/userModel.ts

import { UserType, UserTypeEnum, RoleEnum } from '../types/userType';

export class UserModel {
  private user: UserType | null = null;

  constructor(userData?: Partial<UserType>) {
    if (userData) {
      this.setUser(userData);
    }
  }

  setUser(userData: Partial<UserType>): void {
    this.user = {
      id_user: userData.id_user || 0,
      nom: userData.nom || '',
      prenom: userData.prenom || '',
      email: userData.email || '',
      type_user: userData.type_user || UserTypeEnum.VISITEUR,
      role: userData.role || RoleEnum.USER,
      biographie: userData.biographie,
      photo_url: userData.photo_url,
      telephone: userData.telephone,
      date_naissance: userData.date_naissance,
      date_creation: userData.date_creation || new Date(),
      date_modification: userData.date_modification || new Date(),
      organisation: userData.organisation,
      roles: userData.roles
    };
  }

  getUser(): UserType | null {
    return this.user;
  }

  isVisitor(): boolean {
    return this.user?.type_user === UserTypeEnum.VISITEUR;
  }

  isProfessional(): boolean {
    return this.user?.role === RoleEnum.PROFESSIONNEL;
  }

  isAdmin(): boolean {
    return this.user?.role === RoleEnum.ADMIN;
  }

  canCreateEvent(): boolean {
    // Tous les utilisateurs peuvent créer des événements sauf les visiteurs
    return !this.isVisitor();
  }

  canCreateOeuvre(): boolean {
    // Tous les utilisateurs peuvent créer des œuvres sauf les visiteurs
    return !this.isVisitor();
  }

  requiresOrganisation(): boolean {
    // Un professionnel qui crée un événement doit appartenir à une organisation
    return this.isProfessional();
  }

  hasOrganisation(): boolean {
    return !!this.user?.organisation;
  }

  canCreateEventWithoutOrganisation(): boolean {
    // Seuls les non-professionnels peuvent créer des événements sans organisation
    return this.canCreateEvent() && !this.requiresOrganisation();
  }

  getFullName(): string {
    if (!this.user) return '';
    return `${this.user.prenom} ${this.user.nom}`.trim();
  }

  updateProfile(updates: Partial<UserType>): void {
    if (!this.user) return;
    
    this.user = {
      ...this.user,
      ...updates,
      date_modification: new Date()
    };
  }

  toJSON(): UserType | null {
    return this.user;
  }

  static fromJSON(userData: UserType): UserModel {
    return new UserModel(userData);
  }
}