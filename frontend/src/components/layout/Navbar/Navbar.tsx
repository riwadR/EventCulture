import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Ajustez le chemin selon votre structure
import "./Navbar.css";

interface NavButton {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  // Utiliser le contexte d'authentification
  const { isAuthenticated, logout } = useAuth();

  // Définir les boutons en fonction de l'état d'authentification
  const buttons: NavButton[] = [
    { name: 'Accueil', path: '/' },
    ...(isAuthenticated 
      ? [{ name: 'Mon profil', path: '/' }] 
      : [
          { name: 'Inscription', path: '/register' },
          { name: 'Connexion', path: '/login' }
        ]
    ),
    { name: 'Catalogue', path: '/catalogues' },
    { name: 'Event', path: '/events' },
  ];

  const handleClick = (path: string): void => {
    navigate(path);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <nav>
        {buttons.map((button, index) => (
          <button key={index} onClick={() => handleClick(button.path)}>
            {button.name}
          </button>
        ))}
        
        {/* Bouton de déconnexion affiché uniquement si authentifié */}
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            Déconnexion
          </button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
