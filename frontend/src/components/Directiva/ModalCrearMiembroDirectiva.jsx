// components/directiva/ModalCrearMiembro.jsx
import React, { useState } from 'react';
import useCreateDirectiva from '@hooks/directiva/useCreateDirectiva'; // tu hook para crear

const ModalCrearMiembro = ({ onClose }) => {
  const { crearMiembro } = useCreateDirectiva();
  const [idUsuario, setIdUsuario] = useState('');
  const [idRol, setIdRol] = useState('');
  const [idPeriodo, setIdPeriodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await crearMiembro({ id_usuario: idUsuario, id_rol: idRol, id_periodo: idPeriodo });
      alert('Miembro agregado correctamente');
      onClose();
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Miembro a la Directiva</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            ID Usuario:
            <input
              type="text"
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              required
            />
          </label>
          <label>
            ID Rol:
            <input
              type="text"
              value={idRol}
              onChange={(e) => setIdRol(e.target.value)}
              required
            />
          </label>
          <label>
            ID Periodo:
            <input
              type="text"
              value={idPeriodo}
              onChange={(e) => setIdPeriodo(e.target.value)}
              required
            />
          </label>
          <div className="modal-actions">
            <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Agregar'}</button>
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearMiembro;
