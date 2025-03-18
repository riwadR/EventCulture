import React, { useState, useEffect } from 'react';
import { createEvent, updateEvent, getEventById } from '../../../services/eventService';

const EventForm = ({ match, onValidated }) => {
    const [eventData, setEventData] = useState({
        titre: '',
        description: '',
        type: 'Exposition',
        dateDebut: '',
        dateFin: '',
        id_lieu: '',
        id_createur: ''
    });

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (match && match.params.id) {
            setIsEditMode(true);
            fetchEvent(match.params.id);
        }
    }, [match]);

    const fetchEvent = async (id) => {
        try {
            const data = await getEventById(id);
            setEventData({
                titre: data.titre,
                description: data.description,
                type: data.type,
                dateDebut: data.dateDebut,
                dateFin: data.dateFin,
                id_lieu: data.id_lieu,
                id_createur: data.id_createur
            });
        } catch (error) {
            console.error("There was an error fetching the event:", error);
        }
    };

    const handleChange = (e) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                console.log("Updating event:", match);
                if (onValidated) {
                    onValidated();
                }
                await updateEvent(match.params.id, eventData);
            } else {
                await createEvent(eventData);
            }
        } catch (error) {
            console.error("There was an error submitting the form:", error);
        }
    };

    return (
        <div>
            <h2>{isEditMode ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="titre"
                    value={eventData.titre}
                    onChange={handleChange}
                    placeholder="Event Title"
                    required
                />
                <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    placeholder="Event Description"
                />
                <select
                    name="type"
                    value={eventData.type}
                    onChange={handleChange}
                >
                    <option value="Exposition">Exposition</option>
                    <option value="Atelier">Atelier</option>
                    <option value="Concert">Concert</option>
                </select>
                <input
                    type="datetime-local"
                    name="dateDebut"
                    value={eventData.dateDebut}
                    onChange={handleChange}
                    required
                />
                <input
                    type="datetime-local"
                    name="dateFin"
                    value={eventData.dateFin}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="id_lieu"
                    value={eventData.id_lieu}
                    onChange={handleChange}
                    placeholder="Location ID"
                    required
                />
                <input
                    type="number"
                    name="id_createur"
                    value={eventData.id_createur}
                    onChange={handleChange}
                    placeholder="Creator ID"
                    required
                />
                <button type="submit">{isEditMode ? 'Update' : 'Create'} Event</button>
            </form>
        </div>
    );
};

export default EventForm;
