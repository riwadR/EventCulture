import axios from 'axios';

// Définition des interfaces
interface Oeuvre {
    id_oeuvre: number;
    titre: string;
    description?: string;
    annee?: number;
    type?: string;
    id_artiste?: number;
    id_catalogue?: number;
}

interface OeuvreInput {
    titre: string;
    description?: string;
    annee?: number;
    type?: string;
    id_artiste?: number;
    id_catalogue?: number;
}

const API_URL = process.env.REACT_APP_API_URL + '/oeuvres';

const getAllOeuvres = async (): Promise<Oeuvre[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getOeuvreByPk = async (id: number): Promise<Oeuvre> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createOeuvre = async (oeuvre: OeuvreInput): Promise<Oeuvre> => {
    const response = await axios.post(`${API_URL}/new`, oeuvre);
    return response.data;
};

const updateOeuvre = async (id: number, updatedOeuvre: OeuvreInput): Promise<Oeuvre> => {
    const response = await axios.put(`${API_URL}/${id}`, updatedOeuvre);
    return response.data;
};

const deleteOeuvre = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/delete/${id}`);
};

export {getAllOeuvres, getOeuvreByPk, createOeuvre, deleteOeuvre, updateOeuvre};