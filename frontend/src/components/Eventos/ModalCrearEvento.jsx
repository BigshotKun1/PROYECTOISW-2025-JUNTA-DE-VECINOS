const ModalCrearEvento = ({ fecha, evento, onChange, onGuardar, onCancelar, modoEdicion }) => (
  <div className="modal-overlay">
    <div className="modal modal-crear-evento">
      <h3 className="modal-titulo">
        {modoEdicion ? "Editar evento" : "Crear nuevo evento"}
      </h3>
      <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>📅 Fecha: {fecha}</p>

      <input
        type="text"
        name="nombreEvento"
        placeholder="Nombre del evento"
        value={evento.nombreEvento}
        onChange={onChange}
        className="modal-input"
      />
      <input
        type="text"
        name="lugar_evento"
        placeholder="Lugar"
        value={evento.lugar_evento}
        onChange={onChange}
        className="modal-input"
      />
      <div className="hora-container">
        <div>
          <label>🕒 Inicio</label>
          <input
            type="time"
            name="hora_inicio"
            value={evento.hora_inicio}
            onChange={onChange}
            className="modal-input"
          />
        </div>
        <div>
          <label>🕒 Término</label>
          <input
            type="time"
            name="hora_termino"
            value={evento.hora_termino}
            onChange={onChange}
            className="modal-input"
          />
        </div>
      </div>

      <div className="botones-modal">
        <button className="btn guardar" onClick={onGuardar}>Guardar</button>
        <button className="btn cancelar" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  </div>
);

export default ModalCrearEvento;
