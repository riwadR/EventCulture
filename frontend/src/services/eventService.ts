import axios from 'axios';
import Event from '../models/Event';

interface EventInput {
  type: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  id_lieu: number | null;
  id_createur: number | null;
}

const apiUrl = process.env.REACT_APP_API_URL + '/events';

// Create a new event
export const createEvent = async (eventData: EventInput): Promise<Event> => {
    try {
        const response = await axios.post(`${apiUrl}/new`, eventData);
        return response.data;
    } catch (error) {
        console.error("There was an error creating the event:", error);
        throw error;
    }
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error("There was an error fetching events:", error);
        throw error;
    }
};

// Get event by ID
export const getEventById = async (id: string | number): Promise<Event> => {
    try {
        const response = await axios.get(`${apiUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the event:", error);
        throw error;
    }
};

// Update event
export const updateEvent = async (id: string | number, eventData: EventInput): Promise<Event> => {
    try {
        const response = await axios.put(`${apiUrl}/${id}`, eventData);
        return response.data;
    } catch (error) {
        console.error("There was an error updating the event:", error);
        throw error;
    }
};

// Delete event
export const deleteEvent = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${apiUrl}/delete/${id}`);
    } catch (error) {
        console.error("There was an error deleting the event:", error);
        throw error;
    }
};
