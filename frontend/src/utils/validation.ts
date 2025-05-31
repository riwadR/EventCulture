// utils/validation.ts

import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation basique
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

export const isEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const isPhone = (phone: string): boolean => {
  return VALIDATION_RULES.PHONE_REGEX.test(phone);
};

export const isUrl = (url: string): boolean => {
  return VALIDATION_RULES.URL_REGEX.test(url);
};

export const isMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const isMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const isPasswordStrong = (password: string): boolean => {
  // Au moins 8 caractères, avec au moins une majuscule, une minuscule, un chiffre
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// Validation des fichiers
export const validateFile = (file: File, allowedTypes: string[], maxSize: number): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: 'file',
      message: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
    });
  }

  if (file.size > maxSize) {
    errors.push({
      field: 'file',
      message: `Fichier trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation d'image
export const validateImage = (file: File): ValidationResult => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  return validateFile(file, allowedTypes, maxSize);
};

// Validation de document
export const validateDocument = (file: File): ValidationResult => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  return validateFile(file, allowedTypes, maxSize);
};

// Validation des formulaires utilisateur
export const validateUserForm = (data: {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  telephone?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (data.nom !== undefined) {
    if (!isRequired(data.nom)) {
      errors.push({ field: 'nom', message: ERROR_MESSAGES.REQUIRED_FIELD });
    } else if (!isMinLength(data.nom, VALIDATION_RULES.NAME_MIN_LENGTH)) {
      errors.push({ field: 'nom', message: `Le nom doit contenir au moins ${VALIDATION_RULES.NAME_MIN_LENGTH} caractères` });
    } else if (!isMaxLength(data.nom, VALIDATION_RULES.NAME_MAX_LENGTH)) {
      errors.push({ field: 'nom', message: `Le nom ne peut pas dépasser ${VALIDATION_RULES.NAME_MAX_LENGTH} caractères` });
    }
  }

  if (data.prenom !== undefined) {
    if (!isRequired(data.prenom)) {
      errors.push({ field: 'prenom', message: ERROR_MESSAGES.REQUIRED_FIELD });
    } else if (!isMinLength(data.prenom, VALIDATION_RULES.NAME_MIN_LENGTH)) {
      errors.push({ field: 'prenom', message: `Le prénom doit contenir au moins ${VALIDATION_RULES.NAME_MIN_LENGTH} caractères` });
    } else if (!isMaxLength(data.prenom, VALIDATION_RULES.NAME_MAX_LENGTH)) {
      errors.push({ field: 'prenom', message: `Le prénom ne peut pas dépasser ${VALIDATION_RULES.NAME_MAX_LENGTH} caractères` });
    }
  }

  if (data.email !== undefined) {
    if (!isRequired(data.email)) {
      errors.push({ field: 'email', message: ERROR_MESSAGES.REQUIRED_FIELD });
    } else if (!isEmail(data.email)) {
      errors.push({ field: 'email', message: ERROR_MESSAGES.INVALID_EMAIL });
    }
  }

  if (data.password !== undefined) {
    if (!isRequired(data.password)) {
      errors.push({ field: 'password', message: ERROR_MESSAGES.REQUIRED_FIELD });
    } else if (!isMinLength(data.password, VALIDATION_RULES.PASSWORD_MIN_LENGTH)) {
      errors.push({ field: 'password', message: ERROR_MESSAGES.PASSWORD_TOO_SHORT });
    }
  }

  if (data.confirmPassword !== undefined && data.password !== undefined) {
    if (!passwordsMatch(data.password, data.confirmPassword)) {
      errors.push({ field: 'confirmPassword', message: ERROR_MESSAGES.PASSWORDS_NOT_MATCH });
    }
  }

  if (data.telephone !== undefined && data.telephone.trim() !== '') {
    if (!isPhone(data.telephone)) {
      errors.push({ field: 'telephone', message: 'Numéro de téléphone invalide' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des formulaires d'événement
export const validateEvenementForm = (data: {
  nom_evenement?: string;
  description?: string;
  date_debut?: Date;
  date_fin?: Date;
  contact_email?: string;
  id_lieu?: number;
  id_type_evenement?: number;
  organisations?: number[];
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!isRequired(data.nom_evenement)) {
    errors.push({ field: 'nom_evenement', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!data.id_lieu) {
    errors.push({ field: 'id_lieu', message: 'Le lieu est requis' });
  }

  if (!data.id_type_evenement) {
    errors.push({ field: 'id_type_evenement', message: 'Le type d\'événement est requis' });
  }

  if (!data.organisations || data.organisations.length === 0) {
    errors.push({ field: 'organisations', message: 'Au moins une organisation est requise' });
  }

  if (data.date_debut && data.date_fin) {
    if (new Date(data.date_debut) >= new Date(data.date_fin)) {
      errors.push({ field: 'date_fin', message: 'La date de fin doit être postérieure à la date de début' });
    }
  }

  if (data.contact_email && data.contact_email.trim() !== '') {
    if (!isEmail(data.contact_email)) {
      errors.push({ field: 'contact_email', message: 'Email de contact invalide' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des formulaires d'œuvre
export const validateOeuvreForm = (data: {
  titre?: string;
  id_type_oeuvre?: number;
  id_langue?: number;
  auteurs?: any[];
  annee_creation?: number;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!isRequired(data.titre)) {
    errors.push({ field: 'titre', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!data.id_type_oeuvre) {
    errors.push({ field: 'id_type_oeuvre', message: 'Le type d\'œuvre est requis' });
  }

  if (!data.id_langue) {
    errors.push({ field: 'id_langue', message: 'La langue est requise' });
  }

  if (!data.auteurs || data.auteurs.length === 0) {
    errors.push({ field: 'auteurs', message: 'Au moins un auteur est requis' });
  }

  if (data.annee_creation) {
    const currentYear = new Date().getFullYear();
    if (data.annee_creation > currentYear) {
      errors.push({ field: 'annee_creation', message: 'L\'année de création ne peut pas être dans le futur' });
    }
    if (data.annee_creation < 1000) {
      errors.push({ field: 'annee_creation', message: 'Année de création invalide' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des formulaires d'organisation
export const validateOrganisationForm = (data: {
  nom?: string;
  type_organisation?: string;
  email?: string;
  site_web?: string;
  telephone?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!isRequired(data.nom)) {
    errors.push({ field: 'nom', message: ERROR_MESSAGES.REQUIRED_FIELD });
  }

  if (!data.type_organisation) {
    errors.push({ field: 'type_organisation', message: 'Le type d\'organisation est requis' });
  }

  if (data.email && data.email.trim() !== '') {
    if (!isEmail(data.email)) {
      errors.push({ field: 'email', message: ERROR_MESSAGES.INVALID_EMAIL });
    }
  }

  if (data.site_web && data.site_web.trim() !== '') {
    if (!isUrl(data.site_web)) {
      errors.push({ field: 'site_web', message: 'URL du site web invalide' });
    }
  }

  if (data.telephone && data.telephone.trim() !== '') {
    if (!isPhone(data.telephone)) {
      errors.push({ field: 'telephone', message: 'Numéro de téléphone invalide' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utilitaire pour obtenir le premier message d'erreur d'un champ
export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  const fieldError = errors.find(error => error.field === fieldName);
  return fieldError?.message;
};

// Utilitaire pour vérifier si un champ a des erreurs
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some(error => error.field === fieldName);
};