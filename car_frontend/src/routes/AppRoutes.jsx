import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import CarDetails from '../pages/CarDetails.jsx';
import AddCar from '../pages/AddCar.jsx';
import EditCar from '../pages/EditCar.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/car/:carId" element={<CarDetails />} />
      <Route path="/add-car" element={<AddCar />} />
      <Route path="/edit-car/:carId" element={<EditCar />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
