import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import NotificationList from './components/common/NotificationList/NotificationList';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer';
import { ROUTES } from './config/routes';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/Home';
import AboutPage from './pages/Footer/About/About';
import ContactPage from './pages/Footer/Contact/Contact';
import Legal from './pages/Footer/Legal/Legal';
import Login from './pages/User/login/Login';
import Register from './pages/User/register/Register';
// import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';

// Styles globaux
import './index.scss';
import CatalogueList from './pages/Catalogue/List/CatalogueList';
import EventList from './pages/Event/List/EventList';

// Formulaire(s) d'ajout de données
import LieuForm from './pages/Lieu/New-Update/LieuForm';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <NotificationList />
                <Routes>
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  {/* <Route path={ROUTES.ABOUT} element={<AboutPage />} /> */}
                  {/* <Route path={ROUTES.CONTACT} element={<ContactPage />} /> */}
                  <Route path={ROUTES.EVENTS} element={<EventList />} />
                  <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                  <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                  <Route path={ROUTES.LEGAL} element={<Legal />} />
                  {/* <Route path={ROUTES.EVENT_DETAILS} element={<EventDetailsPage />} /> */}
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.REGISTER} element={<Register />} />
                  <Route path={ROUTES.LIEUX} element={<LieuForm />} />
                  {/* <Route path={ROUTES.PROFILE} element={<ProfilePage />} /> */}
                  <Route path={ROUTES.CATALOGUES} element={
                    <ProtectedRoute>
                      <CatalogueList />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 