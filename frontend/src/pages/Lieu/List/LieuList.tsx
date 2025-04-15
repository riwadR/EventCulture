import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import './LieuList.scss';

interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
}

const LieuList: React.FC = () => {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const data = await apiService.get<Lieu[]>('/lieux');
        setLieux(data);
      } catch (err) {
        setError('Impossible de charger les lieux.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLieux();
  }, []);

  if (isLoading) return <div className="lieu-list-loading">Chargement en cours...</div>;
  if (error) return <div className="lieu-list-error">{error}</div>;
  if (lieux.length === 0) return <div className="lieu-list-empty">Aucun lieu pour le moment.</div>;

  return (
    <div className="lieu-list-container">
      <h3>Liste des lieux</h3>
      <ul className="lieu-list">
        {lieux.map((lieu) => (
          <li key={lieu.id} className="lieu-item">
            <strong>{lieu.nom}</strong><br />
            {lieu.adresse}, {lieu.ville}, {lieu.pays}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LieuList;
