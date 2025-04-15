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
    { name: 'Lieux', path:  'lieux'},
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
        <div className="logo-img" onClick={() => navigate('/')} style={{ backgroundImage: `url(https://media.discordapp.net/attachments/1359154159940669591/1359162977743540394/Agir-removebg-preview.png?ex=67f67aa9&is=67f52929&hm=518cbd34dc94ed277a5419eada663eae280e43dc5a8613ee76e6f92db092bc15&=&format=webp&quality=lossless&width=1026&height=752)` }}></div>
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
