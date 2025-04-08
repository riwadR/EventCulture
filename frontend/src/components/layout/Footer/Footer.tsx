import React from "react";
import { useNavigate } from "react-router";
import "./Footer.scss";

interface FooterButton {
  name: string;
  path: string;
}

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const buttons: FooterButton[] = [
    { name: "À propos", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Mentions légales", path: "/legal" },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Eventculture. Tous droits réservés.
        </p>
        <div className="footer-links">
          {buttons.map((button, index) => (
            <button key={index} onClick={() => navigate(button.path)}>
              {button.name}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
