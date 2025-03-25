import React, { useState } from 'react';
import { createCatalogue } from '../../../services/catalogueService.js';
import { getAllEvents } from '../../../services/eventService.js';
import { useEffect } from 'react';

const CatalogueNew = ({ onCatalogueAdded }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        const eventIds = allEvents.map(event => event.id_event);
        setEvents(eventIds);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCatalogue({ nom, description });
      setNom('');
      setDescription('');
      onCatalogueAdded();
    } catch (error) {
      console.error('Erreur lors de la création du catalogue', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Ajouter un Catalogue</h3>
      <input
        type="text"
        placeholder="Nom du catalogue"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select>
        {events.map(eventId => (
          <option key={eventId} value={eventId}>
        {eventId}
          </option>
        ))}
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default CatalogueNew;
