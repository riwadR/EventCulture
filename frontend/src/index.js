import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router';
import Formulaire from './pages/Formulaire/Formulaire';
import Navbar from './components/Navbar/Navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>

    <Navbar />

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/formulaire" element={<Formulaire />} />
    </Routes>
  </BrowserRouter>
);