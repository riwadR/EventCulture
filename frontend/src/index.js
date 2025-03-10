import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import Formulaire from './pages/Formulaire/Formulaire';
import Navbar from './components/Navbar/Navbar';

import CatalogueList from './pages/Catalogue/List/CatalogueList';
import CatalogueNew from './pages/Catalogue/New/CatalogueNew';
import CatalogueUpdate from './pages/Catalogue/Update/CatalogueUpdate';

import EventList from './pages/Event/List/EventList.js';
import EventForm from './pages/Event/New-Update/EventForm';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>

    <Navbar />

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/formulaire" element={<Formulaire />} />

      // Catalogue
      <Route path="/catalogue" element={<CatalogueList />} />
      <Route path="/catalogue/new" element={<CatalogueNew />} />
      <Route path="/catalogue/update/:id" element={<CatalogueUpdate />} />

      // Event
      <Route path="/event" element={<EventList />} />
      <Route path="/event/new" element={<EventForm />} />
      <Route path="/event/update/:id" element={<EventForm />} />

    </Routes>
  </BrowserRouter>
);