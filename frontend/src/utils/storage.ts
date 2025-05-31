// utils/storage.ts

import { STORAGE_KEYS } from '../constants';

// Interface pour les options de stockage
interface StorageOptions {
  expire?: number; // Durée en millisecondes
  encrypt?: boolean; // Si on veut chiffrer les données sensibles
}

// Interface pour les données avec expiration
interface StorageData<T> {
  value: T;
  timestamp: number;
  expire?: number;
}

// Classe pour gérer le localStorage de manière sécurisée
export class LocalStorage {
  private static instance: LocalStorage;

  private constructor() {}

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  // Vérifier si localStorage est disponible
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Encoder les données (simple base64 pour éviter les conflits)
  private encode(data: any): string {
    try {
      return btoa(JSON.stringify(data));
    } catch {
      return JSON.stringify(data);
    }
  }

  // Décoder les données
  private decode<T>(data: string): T | null {
    try {
      return JSON.parse(atob(data));
    } catch {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }

  // Stocker une valeur
  set<T>(key: string, value: T, options?: StorageOptions): boolean {
    if (!this.isAvailable()) return false;

    try {
      const storageData: StorageData<T> = {
        value,
        timestamp: Date.now(),
        expire: options?.expire
      };

      const encodedData = options?.encrypt ? this.encode(storageData) : JSON.stringify(storageData);
      localStorage.setItem(key, encodedData);
      return true;
    } catch {
      return false;
    }
  }

  // Récupérer une valeur
  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue || null;

      // Essayer de décoder (pour les données chiffrées)
      let storageData: StorageData<T>;
      try {
        storageData = this.decode<StorageData<T>>(item);
      } catch {
        storageData = JSON.parse(item);
      }

      if (!storageData) return defaultValue || null;

      // Vérifier l'expiration
      if (storageData.expire && Date.now() - storageData.timestamp > storageData.expire) {
        this.remove(key);
        return defaultValue || null;
      }

      return storageData.value;
    } catch {
      return defaultValue || null;
    }
  }

  // Supprimer une valeur
  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  // Vider tout le localStorage
  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  // Obtenir toutes les clés
  keys(): string[] {
    if (!this.isAvailable()) return [];

    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }

  // Vérifier si une clé existe
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Obtenir la taille utilisée (approximative)
  getSize(): number {
    if (!this.isAvailable()) return 0;

    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch {
      return 0;
    }
  }
}

// Classe pour gérer le sessionStorage
export class SessionStorage {
  private static instance: SessionStorage;

  private constructor() {}

  public static getInstance(): SessionStorage {
    if (!SessionStorage.instance) {
      SessionStorage.instance = new SessionStorage();
    }
    return SessionStorage.instance;
  }

  private isAvailable(): boolean {
    try {
      const test = '__session_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) return defaultValue || null;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  }

  remove(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
}

// Instances globales
export const localStorage = LocalStorage.getInstance();
export const sessionStorage = SessionStorage.getInstance();

// Fonctions utilitaires spécifiques à l'application
export const StorageUtils = {
  // Gestion du thème
  getTheme(): 'light' | 'dark' {
    return localStorage.get<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
  },

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.set(STORAGE_KEYS.THEME, theme);
  },

  // Gestion de la langue
  getLanguage(): string {
    return localStorage.get<string>(STORAGE_KEYS.LANGUAGE, 'fr');
  },

  setLanguage(language: string): void {
    localStorage.set(STORAGE_KEYS.LANGUAGE, language);
  },

  // Gestion de l'état de la sidebar
  getSidebarCollapsed(): boolean {
    return localStorage.get<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
  },

  setSidebarCollapsed(collapsed: boolean): void {
    localStorage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
  },

  // Gestion des filtres de recherche
  getFilters(page: string): Record<string, any> {
    const allFilters = localStorage.get<Record<string, any>>(STORAGE_KEYS.FILTERS, {});
    return allFilters[page] || {};
  },

  setFilters(page: string, filters: Record<string, any>): void {
    const allFilters = localStorage.get<Record<string, any>>(STORAGE_KEYS.FILTERS, {});
    allFilters[page] = filters;
    localStorage.set(STORAGE_KEYS.FILTERS, allFilters);
  },

  clearFilters(page?: string): void {
    if (page) {
      const allFilters = localStorage.get<Record<string, any>>(STORAGE_KEYS.FILTERS, {});
      delete allFilters[page];
      localStorage.set(STORAGE_KEYS.FILTERS, allFilters);
    } else {
      localStorage.remove(STORAGE_KEYS.FILTERS);
    }
  },

  // Gestion des paramètres de pagination
  getPagination(page: string): { pageSize: number; currentPage: number } {
    const allPagination = localStorage.get<Record<string, any>>(STORAGE_KEYS.PAGINATION, {});
    return allPagination[page] || { pageSize: 20, currentPage: 1 };
  },

  setPagination(page: string, pageSize: number, currentPage: number): void {
    const allPagination = localStorage.get<Record<string, any>>(STORAGE_KEYS.PAGINATION, {});
    allPagination[page] = { pageSize, currentPage };
    localStorage.set(STORAGE_KEYS.PAGINATION, allPagination);
  },

  // Gestion des données temporaires (avec expiration automatique)
  setTempData<T>(key: string, value: T, expireInMinutes: number = 60): void {
    localStorage.set(key, value, { expire: expireInMinutes * 60 * 1000 });
  },

  getTempData<T>(key: string, defaultValue?: T): T | null {
    return localStorage.get<T>(key, defaultValue);
  },

  // Nettoyage des données expirées
  cleanExpiredData(): void {
    const keys = localStorage.keys();
    keys.forEach(key => {
      // Essayer de récupérer chaque élément (cela supprimera automatiquement les éléments expirés)
      localStorage.get(key);
    });
  },

  // Sauvegarde des données de formulaire (pour éviter la perte de données)
  saveFormData(formId: string, data: Record<string, any>): void {
    const key = `form_draft_${formId}`;
    localStorage.set(key, data, { expire: 24 * 60 * 60 * 1000 }); // 24 heures
  },

  getFormData(formId: string): Record<string, any> | null {
    const key = `form_draft_${formId}`;
    return localStorage.get<Record<string, any>>(key);
  },

  clearFormData(formId: string): void {
    const key = `form_draft_${formId}`;
    localStorage.remove(key);
  },

  // Gestion des favoris
  getFavorites(type: string): number[] {
    const key = `favorites_${type}`;
    return localStorage.get<number[]>(key, []);
  },

  addToFavorites(type: string, id: number): void {
    const favorites = this.getFavorites(type);
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.set(`favorites_${type}`, favorites);
    }
  },

  removeFromFavorites(type: string, id: number): void {
    const favorites = this.getFavorites(type);
    const updated = favorites.filter(favId => favId !== id);
    localStorage.set(`favorites_${type}`, updated);
  },

  isFavorite(type: string, id: number): boolean {
    const favorites = this.getFavorites(type);
    return favorites.includes(id);
  },

  // Gestion de l'historique de recherche
  getSearchHistory(type: string): string[] {
    const key = `search_history_${type}`;
    return localStorage.get<string[]>(key, []);
  },

  addToSearchHistory(type: string, query: string, maxItems: number = 10): void {
    if (!query.trim()) return;
    
    const history = this.getSearchHistory(type);
    const updated = [query, ...history.filter(item => item !== query)].slice(0, maxItems);
    localStorage.set(`search_history_${type}`, updated);
  },

  clearSearchHistory(type: string): void {
    const key = `search_history_${type}`;
    localStorage.remove(key);
  },

  // Migration des données (pour les mises à jour)
  migrateData(version: string): void {
    const currentVersion = localStorage.get<string>('app_version');
    
    if (currentVersion !== version) {
      // Ici on peut ajouter la logique de migration selon la version
      console.log(`Migration des données de ${currentVersion} vers ${version}`);
      
      // Marquer la nouvelle version
      localStorage.set('app_version', version);
    }
  },

  // Exportation des données utilisateur
  exportUserData(): string {
    const userData: Record<string, any> = {};
    const keys = localStorage.keys();
    
    keys.forEach(key => {
      if (!key.startsWith('temp_') && !key.startsWith('cache_')) {
        userData[key] = localStorage.get(key);
      }
    });
    
    return JSON.stringify(userData, null, 2);
  },

  // Importation des données utilisateur
  importUserData(data: string): boolean {
    try {
      const userData = JSON.parse(data);
      
      Object.keys(userData).forEach(key => {
        localStorage.set(key, userData[key]);
      });
      
      return true;
    } catch {
      return false;
    }
  }
};