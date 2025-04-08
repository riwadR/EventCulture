import React, { useState, FormEvent, ChangeEvent } from 'react';
import { updateCatalogue } from '../../../services/catalogueService';
import Catalogue from '../../../models/Catalogue';

interface CatalogueUpdateProps {
  catalogue: Catalogue;
  onCatalogueUpdated: () => void;
}

const CatalogueUpdate = ({ catalogue, onCatalogueUpdated }: CatalogueUpdateProps) => {
  const [nom, setNom] = useState(catalogue.nom);
  const [description, setDescription] = useState(catalogue.description);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await updateCatalogue(catalogue.id_catalog as number, { nom, description });
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
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
      />
      <button type="submit">Mettre à jour</button>
    </form>
  );
};

export default CatalogueUpdate;