import api from './api.js';

export const getCars = async (params = {}) => {
  const response = await api.get('/cars', { params });
  return response.data;
};

export const getCarById = async (carId) => {
  const response = await api.get(`/cars/${carId}`);
  return response.data;
};

export const createCar = async (carData) => {
  const response = await api.post('/cars', carData);
  return response.data;
};

export const updateCar = async (carId, carData) => {
  const response = await api.put(`/cars/${carId}`, carData);
  return response.data;
};

export const deleteCar = async (carId) => {
  const response = await api.delete(`/cars/${carId}`);
  return response.data;
};

const carService = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};

export default carService;
