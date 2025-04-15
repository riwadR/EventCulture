import axios from 'axios';
import Lieu from '../models/Lieu';

interface LieuInput {
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
}

const API_URL = process.env.REACT_APP_API_URL + '/lieux';

const getAllLieux = async (): Promise<Lieu[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getLieuById = async (id: number): Promise<Lieu> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createLieu = async (lieu: LieuInput): Promise<Lieu> => {
  const response = await axios.post(`${API_URL}/new`, lieu);
  return response.data;
};

const updateLieu = async (id: number, updatedLieu: LieuInput): Promise<Lieu> => {
  const response = await axios.put(`${API_URL}/${id}`, updatedLieu);
  return response.data;
};

const deleteLieu = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/delete/${id}`);
};

export { getAllLieux, getLieuById, createLieu, updateLieu, deleteLieu };