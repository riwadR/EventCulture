import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import NotificationList from './components/common/NotificationList/NotificationList';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ROUTES } from './config/routes';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/Home';
// import AboutPage from './pages/About';
// import ContactPage from './pages/Contact';
import Login from './pages/User/login/Login';
import Register from './pages/User/register/Register';
// import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';

// Styles globaux
import './index.scss';
import CatalogueList from './pages/Catalogue/List/CatalogueList';
import EventList from './pages/Event/List/EventList';

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
                  <Route path={ROUTES.EVENTS} element={
                    <ProtectedRoute>
                      <EventList />
                    </ProtectedRoute>
                  } />
                  {/* <Route path={ROUTES.EVENT_DETAILS} element={<EventDetailsPage />} /> */}
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.REGISTER} element={<Register />} />
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