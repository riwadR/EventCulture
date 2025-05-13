import React, { useEffect, useState } from 'react';
import { getAllEvents, deleteEvent } from '../../../services/eventService';
import EventForm from '../New-Update/EventForm';
import EventModel from '../../../models/Event';
import Event from '../Event'
import { useNavigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '../../../contexts/AuthContext';

interface EventFormProps {
    match: {
        params: {
            id: string;
        }
    };
    onValidated: () => void;
}

const EventList: React.FC = () => {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [currentEvent, setCurrentEvent] = useState<EventModel | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const { isAuthenticated, logout } = useAuth();
    const isAdmin = useIsAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (): Promise<void> => {
        try {
            const data = await getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("There was an error fetching the events", error);
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        try {
            await deleteEvent(id);
            fetchEvents(); // Refresh the list after deletion
        } catch (error) {
            console.error("There was an error deleting the event:", error);
        }
    };

    return (
        <div>
            <h2>Liste des événements</h2>
            {
                currentEvent ? (
                    <EventForm
                        match={{ params: { id: String(currentEvent.id_event) } }}
                        onValidated={() => {
                            setCurrentEvent(null);
                            fetchEvents();
                        }}
                    />
                ) : isCreating ? (
                    <EventForm
                        match={{ params: { id: "new" } }}
                        onValidated={() => {
                            setIsCreating(false);
                            fetchEvents();
                        }}
                    />
                ) : (
                    <>
                        {isAdmin && (
                            <button
                                onClick={() => setIsCreating(true)}
                                style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Créer un événement
                            </button>
                        )}
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {events.map(event => (
                                <li key={event.id_event} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <h3>{event.titre}</h3>
                                    <p>{event.description}</p>
                                    <p><strong>Début:</strong> {new Date(event.dateDebut).toLocaleString()}</p>
                                    <p><strong>Fin:</strong> {new Date(event.dateFin).toLocaleString()}</p>
                                    <div style={{ marginTop: '10px' }}>
                                        <button
                                            onClick={() => { navigate(`/event/${event.id_event}`); }}
                                            style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#CC8866B3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Voir
                                        </button>
                                        {isAdmin && (
                                            <>
                                                <button
                                                    onClick={() => handleDelete(event.id_event as number)}
                                                    style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Supprimer
                                                </button>
                                                <button
                                                    onClick={() => setCurrentEvent(event)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Modifier
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )
            }
        </div>
    );
};

export default EventList;
