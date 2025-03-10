import React from 'react';
import { useNavigate } from 'react-router';
import './Navbar.css';

const Navbar = () => {

    const navigate = useNavigate();

    const buttons = [
        { name: 'Accueil', path:'/' },
        { name: 'Formulaire', path:'/formulaire' },
    ];

    const handleClick = (path) => {
        navigate(path);
    };

    return (
        <div className="navbar">
            <nav>
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(button.path)}
                    >
                        {button.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
