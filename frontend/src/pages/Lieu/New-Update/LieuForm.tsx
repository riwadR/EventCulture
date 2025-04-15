import React, { useState } from 'react';
import { apiService } from '../../../services/api';
import './LieuForm.scss';

const LieuForm: React.FC = () => {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [pays, setPays] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLieu = { nom, adresse, ville, pays };
      await apiService.post('/lieux/new', newLieu);
      setSuccess('Lieu ajouté avec succès!');
      setNom('');
      setAdresse('');
      setVille('');
      setPays('');
    } catch (err) {
      setError('Erreur lors de l\'ajout du lieu');
    }
  };

  return (
    <div className="lieu-form-container">
      <h3>Ajouter un Lieu</h3>
      <form onSubmit={handleSubmit} className="lieu-form">
        {error && <div className="lieu-form-error">{error}</div>}
        {success && <div className="lieu-form-success">{success}</div>}
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom du lieu"
          required
        />
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          placeholder="Adresse"
          required
        />
        <input
          type="text"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          placeholder="Ville"
          required
        />
        <input
          type="text"
          value={pays}
          onChange={(e) => setPays(e.target.value)}
          placeholder="Pays"
          required
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default LieuForm;
