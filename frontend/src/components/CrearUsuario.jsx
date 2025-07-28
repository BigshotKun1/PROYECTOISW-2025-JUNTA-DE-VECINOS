// src/components/CrearUsuario.jsx
import React, { useState } from 'react';



const CrearUsuario = ({ onCreate, onClose }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    rut: '',
    email: '',
    rol: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose(); // cierra el modal
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombreCompleto" placeholder="Nombre Completo" onChange={handleChange} required />
          <input type="text" name="rut" placeholder="RUT" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
          <input type="text" name="rol" placeholder="Rol" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <button type="submit">Crear</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
