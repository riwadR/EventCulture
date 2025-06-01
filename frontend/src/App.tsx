import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des composants depuis votre structure existante
import { NotificationProvider } from './components/Utils/index';
import MainLayout from './components/Layout/MainLayout';

// Import des formulaires
import OeuvreForm from './components/Forms/OeuvreForms';


// Import des pages (à créer dans src/pages/)
import HomePage from './pages/HomePages';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { OeuvresPage,  PatrimoinePage } from './pages/ListingPages';
import OeuvreDetail from './pages/OeuvreDetail';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <MainLayout>
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<HomePage />} />
            
            {/* Authentication */}
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            
            {/* Œuvres */}
            <Route path="/oeuvres" element={<OeuvresPage />} />
            <Route path="/oeuvres/:id" element={<OeuvreDetail />} />
            <Route path="/oeuvres/nouvelle" element={
              <OeuvreForm 
                onSubmit={async (data) => {
                  console.log('Nouvelle œuvre:', data);
                  // Ici vous appellerez votre API
                  alert('Œuvre créée avec succès !');
                  window.location.href = '/oeuvres';
                }} 
                onCancel={() => window.location.href = '/oeuvres'} 
              />
            } />
            <Route path="/oeuvres/:id/modifier" element={
              <OeuvreForm 
                isEditing={true}
                onSubmit={async (data) => {
                  console.log('Œuvre modifiée:', data);
                  alert('Œuvre modifiée avec succès !');
                  window.location.href = '/oeuvres';
                }} 
                onCancel={() => window.history.back()} 
              />
            } />
            
            {/* Événements */}
         
            <Route path="/evenements/:id" element={<div className="p-8">Détail événement (à implémenter)</div>} />
           
            
            {/* Patrimoine */}
            <Route path="/patrimoine" element={<PatrimoinePage />} />
            <Route path="/patrimoine/:id" element={<div className="p-8">Détail lieu patrimonial (à implémenter)</div>} />
            <Route path="/lieux/nouveau" element={<div className="p-8">Formulaire lieu (à implémenter)</div>} />
            
            {/* Communauté */}
            <Route path="/communaute" element={<div className="p-8">Page communauté (à implémenter)</div>} />
            <Route path="/profil/:id" element={<div className="p-8">Profil utilisateur (à implémenter)</div>} />
            
            {/* Administration */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Recherche */}
            <Route path="/recherche" element={<div className="p-8">Résultats de recherche (à implémenter)</div>} />
            
            {/* Pages légales */}
            <Route path="/conditions" element={<div className="p-8">Conditions d'utilisation (à implémenter)</div>} />
            <Route path="/confidentialite" element={<div className="p-8">Politique de confidentialité (à implémenter)</div>} />
            
            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Page non trouvée</p>
                  <a href="/" className="mt-6 inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </MainLayout>
      </NotificationProvider>
    </Router>
  );
};

export default App;