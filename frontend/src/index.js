import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import Navbar from './components/Navbar/Navbar';

import CatalogueList from './pages/Catalogue/List/CatalogueList';
import CatalogueNew from './pages/Catalogue/New/CatalogueNew';
import CatalogueUpdate from './pages/Catalogue/Update/CatalogueUpdate';

import EventList from './pages/Event/List/EventList.js';
import EventForm from './pages/Event/New-Update/EventForm';

import Login from './pages/User/login/Login.js';
import Register from './pages/User/register/Register.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>

    <Navbar />

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />

      // Catalogue
      <Route path="/catalogues" element={<CatalogueList />} />
      <Route path="/catalogues/new" element={<CatalogueNew />} />
      <Route path="/catalogues/update/:id" element={<CatalogueUpdate />} />

      // Event 
      <Route path="/events/" element={<EventList />} />
      <Route path="/events/new" element={<EventForm />} />
      <Route path="/events/update/:id" element={<EventForm />} />

      {/* User */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

    </Routes>
  </BrowserRouter>
);