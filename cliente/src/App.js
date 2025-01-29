import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './views/Home';
import ResidenteHome from './views/ResidenteHome';
import AdministradorHome from './views/AdministradorHome'; // Importa la nueva vista

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para la página de inicio */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Ruta para Residente */}
        <Route path="/residente" element={<ResidenteHome />} />
        
        {/* Ruta para Administrador */}
        <Route path="/administrador" element={<AdministradorHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
