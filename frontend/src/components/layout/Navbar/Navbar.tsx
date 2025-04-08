import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Ajustez le chemin selon votre structure
import "./Navbar.scss";

interface NavButton {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  // Utiliser le contexte d'authentification
  const { isAuthenticated, logout } = useAuth();

  const navItems: NavButton[] = [
    { name: 'Accueil', path: '/' },
    { name: 'Catalogue', path: '/catalogues' },
    { name: 'Evènement', path: '/events' },
    { name: 'Présentation', path: '/presentation' },
    { name: 'Parcours', path: '/parcours' },
  ];

  const handleClick = (path: string): void => {
    navigate(path);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="logo">
        <span className="logo-text" onClick={() => navigate('/')}>EP</span>
      </div>

      <nav>
        <ul>
          {navItems.map((item, index) => (
            <li key={index} onClick={() => handleClick(item.path)}>
              {item.name}
            </li>
          ))}
        </ul>

        <div className="buttons">
          {isAuthenticated ? (
            <button onClick={handleLogout}>Déconnexion</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Connexion</button>
              <button onClick={() => navigate('/register')}>Inscription</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
