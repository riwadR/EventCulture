import React, { useState } from 'react';
import { updateCatalogue } from '../../services/catalogueService.js';

const CatalogueUpdate = ({ catalogue, onCatalogueUpdated }) => {
  const [nom, setNom] = useState(catalogue.nom);
  const [description, setDescription] = useState(catalogue.description);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCatalogue(catalogue.id_catalog, { nom, description });
      onCatalogueUpdated();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du catalogue', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default CatalogueUpdate;