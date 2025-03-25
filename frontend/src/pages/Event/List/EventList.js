import React, { useEffect, useState } from 'react';
import { getAllEvents, deleteEvent } from '../../../services/eventService';
import EventForm from '../New-Update/EventForm';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("There was an error fetching the events", error);
        }
    };

    const handleDelete = async (id) => {
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
                    <EventForm match={{ params: { id: currentEvent.id_event } }} onValidated={() => {
                        setCurrentEvent(null);
                        fetchEvents();
                    }} />
                ) : (
                    <ul>
                        {events.map(event => (
                            <li key={event.id_event}>
                                <h3>{event.titre}</h3>
                                <p>{event.description}</p>
                                <p><strong>Start:</strong> {new Date(event.dateDebut).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(event.dateFin).toLocaleString()}</p>
                                <button onClick={() => handleDelete(event.id_event)}>Delete</button>
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
