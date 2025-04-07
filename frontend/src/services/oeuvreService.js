import axios from 'axios';

const API_URL = 'http://localhost:3000/api/oeuvres';

const getAllOeuvres = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getOeuvreByPk = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const createOeuvre = async (oeuvre) => {
    const response = await axios.post(`${API_URL}/${id}`);
    return response.data;
};

const updateOeuvre = async (id, updatedOeuvre) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedOeuvre);
    return response.data;
};

const deleteOeuvre = async (id) => {
    await axios.delete(`${API_URL}/delete/${id}`);
};

export {getAllOeuvres, getOeuvreByPk, createOeuvre, deleteOeuvre, updateOeuvre};