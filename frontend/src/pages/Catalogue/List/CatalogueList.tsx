import React, { useEffect, useState } from 'react';
import { getAllCatalogues, deleteCatalogue } from '../../../services/catalogueService';
import CatalogueNew from '../New/CatalogueNew';
import CatalogueUpdate from '../Update/CatalogueUpdate';
import Catalogue from '../../../models/Catalogue';

const CatalogueList: React.FC = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const fetchCatalogues = async (): Promise<void> => {
    try {
      const data = await getAllCatalogues();
      setCatalogues(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catalogues', error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
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