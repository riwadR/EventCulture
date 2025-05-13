import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getEventById } from '../../services/eventService';
import EventModel from '../../models/Event';


const Event: React.FC<{ }> = () => {
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<EventModel>();

  useEffect(() => {
    const id = window.location.href.match(/event\/(\d+)/)?.[1];

    if (id) {
      fetchEvents(id);
    } else {
      console.error('Event ID is undefined');
    }
  }, []);

    const fetchEvents = async (id: string | number) => {
        try {
        const response = await getEventById(id);
        setEvent(response);
        } catch (error) {
        console.error('Error fetching events:', error);
        }
    };

    return (
        <div>
            <h1>{event?.titre}</h1>
            <p>{event?.description}</p>
            <p>Date de début: {event?.dateDebut}</p>
            <p>Date de fin: {event?.dateFin}</p>
            <p>Lieu: {event?.id_lieu}</p>
            <p>Créateur: {event?.id_createur}</p>
        </div>
    );
}

export default Event;