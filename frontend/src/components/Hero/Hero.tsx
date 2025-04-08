import React from "react";
import "./Hero.scss";

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <img
        src="../../assets/img/Carrousel/img1.jpeg"
        alt="Hero"
        className="hero-image"
      />
      <div className="hero-content">
        <h2 className="hero-title">Presentation</h2>
        <h3 className="hero-subheading">Subheading</h3>
        <p>
          Body text for your whole article or post. We'll put in some lorem
          ipsum to show how a filled-out page might look:
        </p>
        <p>
          Excepteur efficient emerging, minim veniam anim aute carefully curated
          Ginza conversation exquisite perfect nostrud nisi intricate Content.
          Qui international first-class nulla ut. Punctual adipisicing,
          essential lovely queen tempor eiusmod irure. Exclusive izakaya
          charming Scandinavian impeccable aute quality of life soft power
          pariatur Melbourne occaecat discerning. Qui wardrobe aliquip, et
          Porter destination Toto remarkable officia Helsinki excepteur Basset
          hound. Zürich sleepy perfect consectetur.
        </p>
      </div>
    </div>
  );
};

export default Hero;
