import React, { createContext, useState, useContext } from "react";

// Création du contexte
const AuthContext = createContext();

// Fournisseur de contexte pour l'état d'authentificati0on
export const AuthProvider = ({ children }) => {
    // Initialisation à false (non authentifié)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        console.log("Login appelé"); // Pour débogage
        setIsAuthenticated(true);
    };
    
    const logout = () => {
        console.log("Logout appelé"); // Pour débogage
        setIsAuthenticated(false);
    };

    console.log("État d'authentification:", isAuthenticated); // Pour débogage

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook pour accéder facilement au contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};