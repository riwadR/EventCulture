import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Eventculture. Tous droits réservés.
        </p>
        <div className="footer-links">
          <a href="/about">À propos</a>
          <a href="/contact">Contact</a>
          <a href="/legal">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
