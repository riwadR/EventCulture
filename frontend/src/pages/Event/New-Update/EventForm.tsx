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
        if (match && match.params.id && match.params.id !== 'new') {
            setIsEditMode(true);
            fetchEvent(match.params.id);
        } else {
            setIsEditMode(false);
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

            if (isEditMode && match && match.params.id !== 'new') {
                console.log("Mise à jour de l'événement:", match.params.id);
                await updateEvent(match.params.id, submitData);
            } else {
                console.log("Création d'un nouvel événement");
                await createEvent(submitData);
            }
            
            if (onValidated) {
                onValidated();
            }
        } catch (error) {
            console.error("There was an error submitting the form:", error);
        }
    };

    return (
        <div>
            <h2>{isEditMode ? 'Modifier l\'événement' : 'Créer un événement'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="titre" style={{ display: 'block', marginBottom: '5px' }}>Titre</label>
                    <input
                        id="titre"
                        type="text"
                        name="titre"
                        value={eventData.titre}
                        onChange={handleChange}
                        placeholder="Titre de l'événement"
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        placeholder="Description de l'événement"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="type" style={{ display: 'block', marginBottom: '5px' }}>Type d'événement</label>
                    <select
                        id="type"
                        name="type"
                        value={eventData.type}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="Exposition">Exposition</option>
                        <option value="Atelier">Atelier</option>
                        <option value="Concert">Concert</option>
                    </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="dateDebut" style={{ display: 'block', marginBottom: '5px' }}>Date de début</label>
                    <input
                        id="dateDebut"
                        type="datetime-local"
                        name="dateDebut"
                        value={eventData.dateDebut}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="dateFin" style={{ display: 'block', marginBottom: '5px' }}>Date de fin</label>
                    <input
                        id="dateFin"
                        type="datetime-local"
                        name="dateFin"
                        value={eventData.dateFin}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="id_lieu" style={{ display: 'block', marginBottom: '5px' }}>ID du lieu</label>
                    <input
                        id="id_lieu"
                        type="number"
                        name="id_lieu"
                        value={eventData.id_lieu}
                        onChange={handleChange}
                        placeholder="Identifiant du lieu"
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="id_createur" style={{ display: 'block', marginBottom: '5px' }}>ID du créateur</label>
                    <input
                        id="id_createur"
                        type="number"
                        name="id_createur"
                        value={eventData.id_createur}
                        onChange={handleChange}
                        placeholder="Identifiant du créateur"
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                <button 
                    type="submit"
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#4CAF50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {isEditMode ? 'Mettre à jour' : 'Créer'} l'événement
                </button>
            </form>
        </div>
    );
};

export default EventForm;
