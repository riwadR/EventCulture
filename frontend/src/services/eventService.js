import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/events'; // URL to your Node.js API

// Create a new event
export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(`${apiUrl}/new`, eventData);
        return response.data;
    } catch (error) {
        console.error("There was an error creating the event:", error);
        throw error;
    }
};

// Get all events
export const getAllEvents = async () => {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error("There was an error fetching events:", error);
        throw error;
    }
};

// Get event by ID
export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${apiUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the event:", error);
        throw error;
    }
};

// Update event
export const updateEvent = async (id, eventData) => {
    try {
        const response = await axios.put(`${apiUrl}/${id}`, eventData);
        return response.data;
    } catch (error) {
        console.error("There was an error updating the event:", error);
        throw error;
    }
};

// Delete event
export const deleteEvent = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("There was an error deleting the event:", error);
        throw error;
    }
};
