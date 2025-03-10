import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import Formulaire from './pages/Formulaire/Formulaire';
import Navbar from './components/Navbar/Navbar';
import CatalogueList from './components/Catalogue/CatalogueList';
import CatalogueNew from './components/Catalogue/CatalogueNew';
import CatalogueUpdate from './components/Catalogue/CatalogueUpdate';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>

    <Navbar />

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/formulaire" element={<Formulaire />} />
      <Route path="/catalogue" element={<CatalogueList />} />
      <Route path="/catalogue/new" element={<CatalogueNew />} />
      <Route path="/catalogue/update/:id" element={<CatalogueUpdate />} />
    </Routes>
  </BrowserRouter>
);