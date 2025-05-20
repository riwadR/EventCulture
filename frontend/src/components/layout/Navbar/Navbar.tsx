import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Navbar.scss";

interface NavButton {
  name: string;
  path: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavButton[] = [
    { name: 'Accueil', path: '/' },
    { name: 'Evènements', path: '/events' },
    { name: 'Présentation', path: '/presentation' },
    { name: 'Lieux', path: '/lieux' },
  ];

  const handleClick = (path: string): void => {
    navigate(path);
    setIsMenuOpen(false); // Fermer le menu après clic
  };

  const handleLogout = (): void => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <div
          className="logo-img"
          onClick={() => navigate('/')}
          style={{ backgroundImage: `url(/images/logo.png)` }}
        ></div>
      </div>

      {/* Burger icon */}
      <div className="burger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={isMenuOpen ? "open" : ""}>
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
