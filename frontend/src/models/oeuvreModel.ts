// models/oeuvreModel.ts

import { OeuvreType, StatutOeuvreEnum } from '../types/oeuvreType';
import { UserType } from '../types/userType';

export class OeuvreModel {
  private oeuvre: OeuvreType | null = null;

  constructor(oeuvreData?: Partial<OeuvreType>) {
    if (oeuvreData) {
      this.setOeuvre(oeuvreData);
    }
  }

  setOeuvre(oeuvreData: Partial<OeuvreType>): void {
    this.oeuvre = {
      id_oeuvre: oeuvreData.id_oeuvre || 0,
      titre: oeuvreData.titre || '',
      id_type_oeuvre: oeuvreData.id_type_oeuvre || 0,
      id_langue: oeuvreData.id_langue || 0,
      annee_creation: oeuvreData.annee_creation,
      description: oeuvreData.description,
      saisi_par: oeuvreData.saisi_par,
      id_oeuvre_originale: oeuvreData.id_oeuvre_originale,
      statut: oeuvreData.statut || StatutOeuvreEnum.BROUILLON,
      date_validation: oeuvreData.date_validation,
      validateur_id: oeuvreData.validateur_id,
      raison_rejet: oeuvreData.raison_rejet,
      date_creation: oeuvreData.date_creation || new Date(),
      date_modification: oeuvreData.date_modification || new Date(),
      typeOeuvre: oeuvreData.typeOeuvre,
      langue: oeuvreData.langue,
      saisieParUser: oeuvreData.saisieParUser,
      oeuvreOriginale: oeuvreData.oeuvreOriginale,
      validateur: oeuvreData.validateur,
      auteurs: oeuvreData.auteurs || [],
      editeurs: oeuvreData.editeurs || [],
      medias: oeuvreData.medias || [],
      critiques: oeuvreData.critiques || [],
      evenements: oeuvreData.evenements || [],
      categories: oeuvreData.categories || [],
      tags: oeuvreData.tags || []
    };
  }

  getOeuvre(): OeuvreType | null {
    return this.oeuvre;
  }

  isPublished(): boolean {
    return this.oeuvre?.statut === StatutOeuvreEnum.PUBLIE;
  }

  isDraft(): boolean {
    return this.oeuvre?.statut === StatutOeuvreEnum.BROUILLON;
  }

  isPending(): boolean {
    return this.oeuvre?.statut === StatutOeuvreEnum.EN_ATTENTE;
  }

  isRejected(): boolean {
    return this.oeuvre?.statut === StatutOeuvreEnum.REJETE;
  }

  isArchived(): boolean {
    return this.oeuvre?.statut === StatutOeuvreEnum.ARCHIVE;
  }

  isDeleted(): boolean {
    return this.oeuvre?.statut === StatutOeuvreEnum.SUPPRIME;
  }

  isTranslation(): boolean {
    return !!this.oeuvre?.id_oeuvre_originale;
  }

  needsValidation(): boolean {
    return this.isPending();
  }

  canBeValidated(): boolean {
    return this.isPending();
  }

  canBePublished(): boolean {
    return this.isDraft() || this.isRejected();
  }

  canBeEdited(user: UserType): boolean {
    if (user.role === 'admin') return true;
    if (this.oeuvre?.saisi_par === user.id_user) {
      return this.isDraft() || this.isRejected();
    }
    return false;
  }

  canBeDeleted(user: UserType): boolean {
    if (user.role === 'admin') return true;
    return this.oeuvre?.saisi_par === user.id_user;
  }

  canBeValidatedBy(user: UserType): boolean {
    return user.role === 'admin' && this.canBeValidated();
  }

  getAuthorCount(): number {
    return this.oeuvre?.auteurs?.length || 0;
  }

  getEditorCount(): number {
    return this.oeuvre?.editeurs?.length || 0;
  }

  getCritiqueCount(): number {
    return this.oeuvre?.critiques?.length || 0;
  }

  getAverageRating(): number | null {
    if (!this.oeuvre?.critiques || this.oeuvre.critiques.length === 0) return null;
    
    const ratings = this.oeuvre.critiques
      .map(c => c.note)
      .filter(note => note !== undefined && note !== null) as number[];
    
    if (ratings.length === 0) return null;
    
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
  }

  submitForValidation(): void {
    if (!this.oeuvre || !this.canBePublished()) return;
    
    this.oeuvre.statut = StatutOeuvreEnum.EN_ATTENTE;
    this.oeuvre.date_modification = new Date();
  }

  validate(validatorId: number): void {
    if (!this.oeuvre || !this.canBeValidated()) return;
    
    this.oeuvre.statut = StatutOeuvreEnum.PUBLIE;
    this.oeuvre.validateur_id = validatorId;
    this.oeuvre.date_validation = new Date();
    this.oeuvre.date_modification = new Date();
    this.oeuvre.raison_rejet = undefined;
  }

  reject(validatorId: number, reason: string): void {
    if (!this.oeuvre || !this.canBeValidated()) return;
    
    this.oeuvre.statut = StatutOeuvreEnum.REJETE;
    this.oeuvre.validateur_id = validatorId;
    this.oeuvre.raison_rejet = reason;
    this.oeuvre.date_modification = new Date();
  }

  archive(): void {
    if (!this.oeuvre) return;
    
    this.oeuvre.statut = StatutOeuvreEnum.ARCHIVE;
    this.oeuvre.date_modification = new Date();
  }

  addTag(tagName: string): void {
    if (!this.oeuvre) return;
    
    const existingTag = this.oeuvre.tags?.find(tag => tag.nom === tagName);
    if (existingTag) return;

    const newTag = {
      id_tag: 0,
      nom: tagName,
      description: undefined
    };

    this.oeuvre.tags = this.oeuvre.tags || [];
    this.oeuvre.tags.push(newTag);
  }

  removeTag(tagName: string): void {
    if (!this.oeuvre?.tags) return;
    this.oeuvre.tags = this.oeuvre.tags.filter(tag => tag.nom !== tagName);
  }

  getTags(): string[] {
    return this.oeuvre?.tags?.map(tag => tag.nom) || [];
  }

  toJSON(): OeuvreType | null {
    return this.oeuvre;
  }

  static fromJSON(oeuvreData: OeuvreType): OeuvreModel {
    return new OeuvreModel(oeuvreData);
  }
}