// constants/index.ts

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Auth Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_DATA_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SIZES: [10, 20, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: {
    IMAGE: 10 * 1024 * 1024, // 10MB
    DOCUMENT: 50 * 1024 * 1024, // 50MB
    VIDEO: 100 * 1024 * 1024, // 100MB
  },
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov'],
  },
} as const;

// User Types Labels
export const USER_TYPE_LABELS = {
  ecrivain: 'Écrivain',
  journaliste: 'Journaliste',
  scientifique: 'Scientifique',
  acteur: 'Acteur',
  artiste: 'Artiste',
  artisan: 'Artisan',
  realisateur: 'Réalisateur',
  musicien: 'Musicien',
  photographe: 'Photographe',
  danseur: 'Danseur',
  sculpteur: 'Sculpteur',
  visiteur: 'Visiteur',
} as const;

// Role Labels
export const ROLE_LABELS = {
  user: 'Utilisateur',
  professionnel: 'Professionnel',
  admin: 'Administrateur',
} as const;

// Organisation Types Labels
export const ORGANISATION_TYPE_LABELS = {
  association: 'Association',
  entreprise: 'Entreprise',
  institution: 'Institution',
  collectivite: 'Collectivité',
  ong: 'ONG',
  fondation: 'Fondation',
  cooperative: 'Coopérative',
  syndicat: 'Syndicat',
  autre: 'Autre',
} as const;

// Oeuvre Status Labels
export const OEUVRE_STATUS_LABELS = {
  brouillon: 'Brouillon',
  en_attente: 'En attente',
  publie: 'Publié',
  rejete: 'Rejeté',
  archive: 'Archivé',
  supprime: 'Supprimé',
} as const;

// Article Types Labels
export const ARTICLE_TYPE_LABELS = {
  presse: 'Article de presse',
  blog: 'Article de blog',
  magazine: 'Article de magazine',
  newsletter: 'Newsletter',
  communique: 'Communiqué',
  editorial: 'Éditorial',
  interview: 'Interview',
  reportage: 'Reportage',
  autre: 'Autre',
} as const;

// Participation Status Labels
export const PARTICIPATION_STATUS_LABELS = {
  inscrit: 'Inscrit',
  confirme: 'Confirmé',
  present: 'Présent',
  absent: 'Absent',
  annule: 'Annulé',
} as const;

// Credibility Level Labels
export const CREDIBILITY_LEVEL_LABELS = {
  tres_fiable: 'Très fiable',
  fiable: 'Fiable',
  moyen: 'Moyen',
  peu_fiable: 'Peu fiable',
  non_verifie: 'Non vérifié',
} as const;

// Lieu Types Labels
export const LIEU_TYPE_LABELS = {
  Wilaya: 'Wilaya',
  Daira: 'Daïra',
  Commune: 'Commune',
} as const;

// Monument Types Labels
export const MONUMENT_TYPE_LABELS = {
  'Mosquée': 'Mosquée',
  'Palais': 'Palais',
  'Statue': 'Statue',
  'Tour': 'Tour',
  'Musée': 'Musée',
} as const;

// Vestige Types Labels
export const VESTIGE_TYPE_LABELS = {
  'Ruines': 'Ruines',
  'Murailles': 'Murailles',
  'Site archéologique': 'Site archéologique',
} as const;

// Editeur Types Labels
export const EDITEUR_TYPE_LABELS = {
  maison_edition: 'Maison d\'édition',
  label_musique: 'Label musical',
  studio_cinema: 'Studio de cinéma',
  galerie_art: 'Galerie d\'art',
  editeur_scientifique: 'Éditeur scientifique',
  presse: 'Presse',
  editeur_numerique: 'Éditeur numérique',
  autre: 'Autre',
} as const;

// Editeur Role Labels
export const EDITEUR_ROLE_LABELS = {
  editeur_principal: 'Éditeur principal',
  co_editeur: 'Co-éditeur',
  distributeur: 'Distributeur',
  editeur_original: 'Éditeur original',
  editeur_traduction: 'Éditeur traduction',
  editeur_numerique: 'Éditeur numérique',
  reedition: 'Réédition',
  autre: 'Autre',
} as const;

// Edition Status Labels
export const EDITION_STATUS_LABELS = {
  en_cours: 'En cours',
  publie: 'Publié',
  epuise: 'Épuisé',
  annule: 'Annulé',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  USERS: '/users',
  EVENEMENTS: '/evenements',
  OEUVRES: '/oeuvres',
  ORGANISATIONS: '/organisations',
  ADMIN: '/admin',
  VALIDATION: '/admin/validation',
  SETTINGS: '/settings',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  FILTERS: 'filters',
  PAGINATION: 'pagination',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  URL_REGEX: /^https?:\/\/.+/,
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Modal Keys
export const MODAL_KEYS = {
  CREATE_EVENEMENT: 'createEvenement',
  EDIT_EVENEMENT: 'editEvenement',
  DELETE_EVENEMENT: 'deleteEvenement',
  CREATE_OEUVRE: 'createOeuvre',
  EDIT_OEUVRE: 'editOeuvre',
  DELETE_OEUVRE: 'deleteOeuvre',
  CREATE_ORGANISATION: 'createOrganisation',
  EDIT_ORGANISATION: 'editOrganisation',
  JOIN_ORGANISATION: 'joinOrganisation',
  CONFIRM_ACTION: 'confirmAction',
  IMAGE_PREVIEW: 'imagePreview',
  USER_PROFILE: 'userProfile',
} as const;

// Loading Keys
export const LOADING_KEYS = {
  AUTH: 'auth',
  USERS: 'users',
  EVENEMENTS: 'evenements',
  OEUVRES: 'oeuvres',
  ORGANISATIONS: 'organisations',
  UPLOAD: 'upload',
  DELETE: 'delete',
  VALIDATION: 'validation',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Erreur de validation des données',
  SERVER_ERROR: 'Erreur interne du serveur',
  TIMEOUT: 'Délai d\'attente dépassé',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  FILE_TOO_LARGE: 'Fichier trop volumineux',
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_NOT_MATCH: 'Les mots de passe ne correspondent pas',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  EVENEMENT_CREATED: 'Événement créé avec succès',
  EVENEMENT_UPDATED: 'Événement mis à jour avec succès',
  EVENEMENT_DELETED: 'Événement supprimé avec succès',
  OEUVRE_CREATED: 'Œuvre créée avec succès',
  OEUVRE_UPDATED: 'Œuvre mise à jour avec succès',
  OEUVRE_DELETED: 'Œuvre supprimée avec succès',
  ORGANISATION_CREATED: 'Organisation créée avec succès',
  ORGANISATION_UPDATED: 'Organisation mise à jour avec succès',
  FILE_UPLOADED: 'Fichier téléchargé avec succès',
  CHANGES_SAVED: 'Modifications sauvegardées',
} as const;

// Colors (for consistency)
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// Breakpoints (responsive design)
export const BREAKPOINTS = {
  XS: '480px',
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Z-Index values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Debounce Delays
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  RESIZE: 100,
  SCROLL: 50,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
} as const;