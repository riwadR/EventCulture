import axios from 'axios';

const API_URL = 'http://localhost:3001/api/catalogues';

const getAllCatalogues = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getCatalogueById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createCatalogue = async (catalogue) => {
  const response = await axios.post(`${API_URL}/new`, catalogue);
  return response.data;
};

const updateCatalogue = async (id, updatedCatalogue) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedCatalogue);
  return response.data;
};

const deleteCatalogue = async (id) => {
  await axios.delete(`${API_URL}/delete/${id}`);
};

export { getAllCatalogues, getCatalogueById, createCatalogue, updateCatalogue, deleteCatalogue };