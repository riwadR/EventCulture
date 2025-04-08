import React, { useEffect, useState } from 'react';
import { getAllEvents, deleteEvent } from '../../../services/eventService';
import EventForm from '../New-Update/EventForm';
import Event from '../../../models/Event';

interface EventFormProps {
    match: {
        params: {
            id: string;
        }
    };
    onValidated: () => void;
}

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

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
            <h2>Event List</h2>
            {
                currentEvent ? (
                    <EventForm 
                        match={{ params: { id: String(currentEvent.id_event) } }} 
                        onValidated={() => {
                            setCurrentEvent(null);
                            fetchEvents();
                        }}
                    />
                ) : (
                    <ul>
                        {events.map(event => (
                            <li key={event.id_event}>
                                <h3>{event.titre}</h3>
                                <p>{event.description}</p>
                                <p><strong>Start:</strong> {new Date(event.dateDebut).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(event.dateFin).toLocaleString()}</p>
                                <button onClick={() => handleDelete(event.id_event as number)}>Delete</button>
                                <button onClick={() => setCurrentEvent(event)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                )
            }

        </div>
    );
};

export default EventList;
