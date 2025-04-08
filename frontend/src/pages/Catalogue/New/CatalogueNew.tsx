import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { createCatalogue } from '../../../services/catalogueService';
import { getAllEvents } from '../../../services/eventService';
import Event from '../../../models/Event';

interface CatalogueNewProps {
  onCatalogueAdded: () => void;
}

const CatalogueNew = ({ onCatalogueAdded }: CatalogueNewProps) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [eventId, setEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        const allEvents = await getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await createCatalogue({ 
        nom, 
        description,
        id_event: eventId || undefined 
      });
      setNom('');
      setDescription('');
      setEventId(null);
      onCatalogueAdded();
    } catch (error) {
      console.error('Erreur lors de la création du catalogue', error);
    }
  };

  const handleEventChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedId = e.target.value ? parseInt(e.target.value, 10) : null;
    setEventId(selectedId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter un Catalogue</h3>
      <input
        type="text"
        placeholder="Nom du catalogue"
        value={nom}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
      />
      <select 
        value={eventId?.toString() || ''} 
        onChange={handleEventChange}
      >
        <option value="">Sélectionnez un événement</option>
        {events.map(event => (
          <option key={event.id_event} value={event.id_event?.toString()}>
            {event.titre}
          </option>
        ))}
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default CatalogueNew;
