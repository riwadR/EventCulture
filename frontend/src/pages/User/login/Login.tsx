import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Ajustez le chemin selon votre structure
import "./Login.scss";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();
    
    // Récupérer le message et la page d'origine si redirigé
    const state = location.state as { from?: { pathname: string }; message?: string } | null;
    const message = state?.message;
    const from = state?.from?.pathname || '/';
    
    // Récupérer la fonction login du contexte
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const request = {
            email,
            password,
        };

        fetch("http://localhost:3001/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la connexion');
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                // Activer l'état authentifié
                login(email, password);
                // Redirection vers la page d'origine si redirigé, sinon vers la racine
                navigate(from);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert('Erreur de connexion: ' + error.message);
            });
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            
            {/* Afficher le message de redirection s'il existe */}
            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </div>
    );
};

export default Login;
