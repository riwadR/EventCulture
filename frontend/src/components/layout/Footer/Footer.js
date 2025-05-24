import React from "react";
import { useNavigate } from "react-router";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();

  const buttons = [
    { name: "À propos", path: "/about", external: false },
    { name: "Contact", path: "/contact", external: false },
    { name: "Mentions légales", path: "/legal", external: false },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook size={20} />,
      path: "https://www.facebook.com/share/16BZAfML6D/",
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={20} />,
      path: "https://www.instagram.com/agir_villages_aures?igsh=ZjE2aTRkMHQ3bjR4",
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
        <div className="footer-social">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.path}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="social-icon"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
