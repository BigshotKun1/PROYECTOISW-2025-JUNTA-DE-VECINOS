const ModalDetalleEvento = ({ evento, onClose, onEditar }) => {
  if (!evento) return null;

  return (
    <div className="modal-evento">
      <button onClick={onClose} className="cerrar-btn">X</button>
      <button onClick={onEditar} className="editar-btn" title="Editar evento">✏️</button>
      <h3>{evento.title}</h3>
      <p><strong>📅 Fecha:</strong> {evento.fecha}</p>
      <p><strong>🕒 Hora:</strong> {evento.horaInicio} - {evento.horaTermino}</p>
      <p><strong>📍 Lugar:</strong> {evento.lugar}</p>
      <p><strong>👤 Organizado por:</strong> {evento.organizador}</p>
    </div>
  );
};

export default ModalDetalleEvento;
