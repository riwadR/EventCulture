import React, { useState, useEffect } from 'react';
import './Carrousel.css';

import img1 from '../img/Carrousel/img1.jpeg';
import img2 from '../img/Carrousel/img2.jpg';
import img3 from '../img/Carrousel/img3.jpg';
import img4 from '../img/Carrousel/img4.jpg';
import img5 from '../img/Carrousel/img5.jpg';

const images = [img1, img2, img3, img4, img5];

const Carrousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change l'image toutes les 3 secondes

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carrousel">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Slide ${index}`}
                    className={index === currentIndex ? 'active' : ''}
                />
            ))}
        </div>
    );
};

export default Carrousel;