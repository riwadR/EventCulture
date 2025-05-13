import React from "react";
import { useNavigate } from "react-router";
import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();

  const buttons = [
    { name: "À propos", path: "/about", external: false },
    { name: "Contact", path: "/contact", external: false },
    { name: "Mentions légales", path: "/legal", external: false },
    {
      name: "Facebook",
      path: "https://www.facebook.com/share/16BZAfML6D/",
      external: true,
    },
    {
      name: "Instagram",
      path: "https://www.instagram.com/agir_villages_aures?igsh=ZjE2aTRkMHQ3bjR4",
      external: true,
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Eventculture. Tous droits réservés.
        </p>
        <div className="footer-links">
          {buttons.map((button, index) =>
            button.external ? (
              <a
                key={index}
                href={button.path}
                target="_blank"
                rel="noopener noreferrer"
              >
                {button.name}
              </a>
            ) : (
              <button key={index} onClick={() => navigate(button.path)}>
                {button.name}
              </button>
            )
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
