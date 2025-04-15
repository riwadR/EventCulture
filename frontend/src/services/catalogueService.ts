import axios from 'axios';
import Catalogue from '../models/Catalogue';

interface CatalogueInput {
  nom: string;
  description: string;
  id_event?: number;
}

const API_URL = process.env.REACT_APP_API_URL + '/catalogues';

const getAllCatalogues = async (): Promise<Catalogue[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getCatalogueById = async (id: number): Promise<Catalogue> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createCatalogue = async (catalogue: CatalogueInput): Promise<Catalogue> => {
  const response = await axios.post(`${API_URL}/new`, catalogue);
  return response.data;
};

const updateCatalogue = async (id: number, updatedCatalogue: CatalogueInput): Promise<Catalogue> => {
  const response = await axios.put(`${API_URL}/${id}`, updatedCatalogue);
  return response.data;
};

const deleteCatalogue = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/delete/${id}`);
};

export { getAllCatalogues, getCatalogueById, createCatalogue, updateCatalogue, deleteCatalogue };