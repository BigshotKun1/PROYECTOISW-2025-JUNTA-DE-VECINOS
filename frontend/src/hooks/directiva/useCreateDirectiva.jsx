import React, { useState } from 'react';
import useCreateDirectiva from '@hooks/directiva/useCreateDirectiva';

const ModalCrearMiembro = ({ onClose }) => {
  const { crearMiembro } = useCreateDirectiva();
  const [rut, setRut] = useState('');
  const [rolId, setRolId] = useState('');
  const [periodoId, setPeriodoId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearMiembro({ id_usuario: rut, id_rol: rolId, id_periodo: periodoId });
      alert('Miembro agregado correctamente');
      onClose();
    } catch (error) {
      alert('Error al agregar miembro: ' + error?.response?.data?.message || 'Error inesperado');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar miembro a la directiva</h2>
        <form onSubmit={handleSubmit}>
          <label>
            RUT Usuario:
            <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required />
          </label>
          <label>
            ID Rol:
            <input type="text" value={rolId} onChange={(e) => setRolId(e.target.value)} required />
          </label>
          <label>
            ID Periodo:
            <input type="text" value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} required />
          </label>
          <div className="modal-actions">
            <button type="submit">Agregar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearMiembro;
