import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate 
      to={ROUTES.LOGIN} 
      state={{ 
        from: location,
        message: "Vous devez être connecté pour accéder à cette page."
      }} 
      replace 
    />;
  }

  // Afficher le contenu protégé si l'utilisateur est authentifié
  return <>{children}</>;
};

export default ProtectedRoute; 