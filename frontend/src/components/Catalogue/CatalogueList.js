import React, { useEffect, useState } from 'react';
import { getAllCatalogues, deleteCatalogue } from '../../services/catalogueService.js';
import CatalogueNew from './CatalogueNew.js';
import CatalogueUpdate from './CatalogueUpdate.js';

const CatalogueList = () => {
  const [catalogues, setCatalogues] = useState([]);

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async () => {
    try {
      const data = await getAllCatalogues();
      setCatalogues(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catalogues', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCatalogue(id);
      setCatalogues(catalogues.filter(catalogue => catalogue.id_catalog !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du catalogue', error);
    }
  };

  return (
    <div>
      <h2>Liste des catalogues</h2>
      <CatalogueNew onCatalogueAdded={fetchCatalogues} />
      <ul>
        {catalogues.map((catalogue) => (
          <li key={catalogue.id_catalog}>
            {catalogue.nom} - {catalogue.description}
            <CatalogueUpdate catalogue={catalogue} onCatalogueUpdated={fetchCatalogues} />
            <button onClick={() => handleDelete(catalogue.id_catalog)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatalogueList;