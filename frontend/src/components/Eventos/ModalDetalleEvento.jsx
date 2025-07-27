import { useState } from "react";
import { useEffect } from "react";
const ModalDetalleEvento = ({ evento, onClose, onEditar }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("usuario"));
    setUser(userData);
  }, []);
  
  if (!evento) return null;

  return (
    <div className="modal-evento">
      <button onClick={onClose} className="cerrar-btn">X</button>

      {user?.rol !== 'Vecino' && (
        <button onClick={onEditar} className="editar-btn" title="Editar evento">✏️</button>
      )}

      <h3>{evento.title}</h3>
      <p><strong>📅 Fecha:</strong> {evento.fecha}</p>
      <p><strong>🕒 Hora:</strong> {evento.horaInicio} - {evento.horaTermino}</p>
      <p><strong>📍 Lugar:</strong> {evento.lugar}</p>
      <p><strong>👤 Organizado por:</strong> {evento.organizador}</p>
    </div>
  );
};

export default ModalDetalleEvento;
