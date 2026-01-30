import React from 'react';
import {Routes, Route } from 'react-router-dom';
import {Login} from '../pages/Login.jsx';
import {Register} from '../pages/Register.jsx';
import {Home} from '../pages/Home.jsx';


const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* We'll add more routes later */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />  
      </Routes>
  );
};

export default AppRoutes;