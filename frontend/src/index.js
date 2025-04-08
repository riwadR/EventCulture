import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
// Importez vos composants'=
import Login from './pages/User/login/Login'; // Ajustez le chemin selon votre structure
import Register from './pages/User/register/Register'; // Ajustez le chemin selon votre structure

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/catalogues" element={<div>Page de catalogues</div>} />
            <Route path="/events" element={<div>Page d'événements</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);