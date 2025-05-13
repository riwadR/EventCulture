import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { User, AuthContextType, RegisterData } from '../types/auth';

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Fournisseur de contexte pour l'état d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    setIsLoading(true);
                    const userData = await apiService.get<User>('/auth/me');
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to get user data:', err);
                    localStorage.removeItem('token');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Connecter un utilisateur
    const login = useCallback(async (email: string, password: string): Promise<User> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiService.post<{ token: string; user: User }>('/auth/login', { email, password });
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return response.user;
        } catch (err: any) {
            setError(err.message || 'Échec de la connexion');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Inscrire un utilisateur
    const register = useCallback(async (userData: RegisterData): Promise<User> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiService.post<{ token: string; user: User }>('/auth/register', userData);
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return response.user;
        } catch (err: any) {
            setError(err.message || 'Échec de l\'inscription');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Déconnecter un utilisateur
    const logout = useCallback((): void => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    // Mettre à jour le profil utilisateur
    const updateProfile = useCallback(async (userData: Partial<User>): Promise<User> => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedUser = await apiService.put<User>('/auth/profile', userData);
            setUser(updatedUser);
            return updatedUser;
        } catch (err: any) {
            setError(err.message || 'Échec de la mise à jour du profil');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pour accéder facilement au contexte
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const useIsAdmin = (): boolean => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context.user?.role === 'admin';
}

export default AuthContext; 