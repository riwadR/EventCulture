// models/evenementModel.ts

import { EvenementType, StatutParticipationEnum } from '../types/evenementType';
import { UserType } from '../types/userType';

export class EvenementModel {
  private evenement: EvenementType | null = null;

  constructor(evenementData?: Partial<EvenementType>) {
    if (evenementData) {
      this.setEvenement(evenementData);
    }
  }

  setEvenement(evenementData: Partial<EvenementType>): void {
    this.evenement = {
      id_evenement: evenementData.id_evenement || 0,
      nom_evenement: evenementData.nom_evenement || '',
      description: evenementData.description,
      date_debut: evenementData.date_debut,
      date_fin: evenementData.date_fin,
      contact_email: evenementData.contact_email,
      contact_telephone: evenementData.contact_telephone,
      image_url: evenementData.image_url,
      id_lieu: evenementData.id_lieu || 0,
      id_user: evenementData.id_user || 0,
      id_type_evenement: evenementData.id_type_evenement || 0,
      date_creation: evenementData.date_creation || new Date(),
      date_modification: evenementData.date_modification || new Date(),
      lieu: evenementData.lieu,
      organisateur: evenementData.organisateur,
      typeEvenement: evenementData.typeEvenement,
      participants: evenementData.participants || [],
      oeuvres: evenementData.oeuvres || [],
      organisations: evenementData.organisations || [],
      programmes: evenementData.programmes || [],
      medias: evenementData.medias || []
    };
  }

  getEvenement(): EvenementType | null {
    return this.evenement;
  }

  isUpcoming(): boolean {
    if (!this.evenement?.date_debut) return false;
    return new Date(this.evenement.date_debut) > new Date();
  }

  isPast(): boolean {
    if (!this.evenement?.date_fin) return false;
    return new Date(this.evenement.date_fin) < new Date();
  }

  isOngoing(): boolean {
    if (!this.evenement?.date_debut || !this.evenement?.date_fin) return false;
    const now = new Date();
    return new Date(this.evenement.date_debut) <= now && new Date(this.evenement.date_fin) >= now;
  }

  getDuration(): number | null {
    if (!this.evenement?.date_debut || !this.evenement?.date_fin) return null;
    const debut = new Date(this.evenement.date_debut);
    const fin = new Date(this.evenement.date_fin);
    return fin.getTime() - debut.getTime();
  }

  getDurationInDays(): number | null {
    const duration = this.getDuration();
    if (!duration) return null;
    return Math.ceil(duration / (1000 * 60 * 60 * 24));
  }

  getParticipantCount(): number {
    return this.evenement?.participants?.length || 0;
  }

  getOeuvreCount(): number {
    return this.evenement?.oeuvres?.length || 0;
  }

  hasOrganisation(): boolean {
    return (this.evenement?.organisations?.length || 0) > 0;
  }

  addParticipant(userId: number, role: string): void {
    if (!this.evenement) return;
    
    const existingParticipant = this.evenement.participants?.find(p => p.id_user === userId);
    if (existingParticipant) return;

    const newParticipant = {
      id_EventUser: 0,
      id_evenement: this.evenement.id_evenement,
      id_user: userId,
      role_participation: role,
      date_inscription: new Date(),
      statut_participation: StatutParticipationEnum.INSCRIT
    };

    this.evenement.participants = this.evenement.participants || [];
    this.evenement.participants.push(newParticipant);
  }

  removeParticipant(userId: number): void {
    if (!this.evenement?.participants) return;
    this.evenement.participants = this.evenement.participants.filter(p => p.id_user !== userId);
  }

  updateParticipantStatus(userId: number, status: StatutParticipationEnum): void {
    if (!this.evenement?.participants) return;
    const participant = this.evenement.participants.find(p => p.id_user === userId);
    if (participant) {
      participant.statut_participation = status;
    }
  }

  isParticipant(userId: number): boolean {
    return this.evenement?.participants?.some(p => p.id_user === userId) || false;
  }

  isOrganisateur(userId: number): boolean {
    return this.evenement?.id_user === userId;
  }

  canEdit(user: UserType): boolean {
    if (user.role === 'admin') return true;
    return this.isOrganisateur(user.id_user);
  }

  canDelete(user: UserType): boolean {
    if (user.role === 'admin') return true;
    return this.isOrganisateur(user.id_user);
  }

  toJSON(): EvenementType | null {
    return this.evenement;
  }

  static fromJSON(evenementData: EvenementType): EvenementModel {
    return new EvenementModel(evenementData);
  }
}