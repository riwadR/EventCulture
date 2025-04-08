import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { createEvent, updateEvent, getEventById } from '../../../services/eventService';

interface EventFormProps {
    match?: {
        params: {
            id: string;
        };
    };
    onValidated?: () => void;
}

interface EventData {
    titre: string;
    description: string;
    type: string;
    dateDebut: string;
    dateFin: string;
    id_lieu: string | number | '';
    id_createur: string | number | '';
}

const EventForm = ({ match, onValidated }: EventFormProps) => {
    const [eventData, setEventData] = useState<EventData>({
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

    const fetchEvent = async (id: string): Promise<void> => {
        try {
            const data = await getEventById(id);
            setEventData({
                titre: data.titre,
                description: data.description,
                type: data.type,
                dateDebut: data.dateDebut,
                dateFin: data.dateFin,
                id_lieu: data.id_lieu !== null ? data.id_lieu : '',
                id_createur: data.id_createur !== null ? data.id_createur : ''
            });
        } catch (error) {
            console.error("There was an error fetching the event:", error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            // Préparer les données pour l'API
            const submitData = {
                ...eventData,
                id_lieu: eventData.id_lieu === '' ? null : Number(eventData.id_lieu),
                id_createur: eventData.id_createur === '' ? null : Number(eventData.id_createur)
            };

            if (isEditMode && match) {
                console.log("Updating event:", match);
                await updateEvent(match.params.id, submitData);
                if (onValidated) {
                    onValidated();
                }
            } else {
                await createEvent(submitData);
                if (onValidated) {
                    onValidated();
                }
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
