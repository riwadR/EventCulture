import React from "react";
import { useNavigate } from "react-router";
import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();

  const buttons = [
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
