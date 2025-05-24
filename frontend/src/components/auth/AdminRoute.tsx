import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAdmin } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useIsAdmin();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas administrateur
  if (!isAdmin) {
    return <Navigate
      to={ROUTES.LOGIN}
      state={{ 
        from: location,
        message: "Vous devez être administrateur pour accéder à cette page."
      }}
      replace
    />;
  }

  // Afficher le contenu protégé si l'utilisateur est administrateur
  return <>{children}</>;
};

export default AdminRoute; 