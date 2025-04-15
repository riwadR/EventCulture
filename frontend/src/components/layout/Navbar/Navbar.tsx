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
    { name: 'Evènements', path: '/events' },
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
        <div className="logo-img" onClick={() => navigate('/')} style={{ backgroundImage: `url(https://cdn.discordapp.com/attachments/1359154159940669591/1359162977743540394/Agir-removebg-preview.png?ex=67fdbae9&is=67fc6969&hm=1903a02a5a0bfe6476c5b192c854793afb754cce60572e1beeaf842de52e59d8&)` }}></div>
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
