import React, { useState } from "react";
import '@styles/CrearVotacionModal.css';

const CrearVotacionModal = ({ open, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    titulo_votacion: "",
    descripcion_votacion: "",
    fecha_votacion: "",
    hora_inicio: "",
    hora_termino: "",
    opciones: ["Si", "No"]
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpcionChange = (idx, value) => {
    const nuevasOpciones = [...form.opciones];
    nuevasOpciones[idx] = value;
    setForm({ ...form, opciones: nuevasOpciones });
  };

  const agregarOpcion = () => {
    setForm({ ...form, opciones: [...form.opciones, ""] });
  };

  const eliminarOpcion = idx => {
    const nuevasOpciones = form.opciones.filter((_, i) => i !== idx);
    setForm({ ...form, opciones: nuevasOpciones });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setShowConfirm(true);
  };
console.log("FECHA VOTACION",form.fecha_votacion)
  const handleConfirmYes = async () => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    await onConfirm({
      ...form,
      // id_usuario: usuario?.id_usuario // ya no se envía si el backend lo toma del JWT
    });
    setForm({
      titulo_votacion: "",
      descripcion_votacion: "",
      fecha_votacion: "",
      hora_inicio: "",
      hora_termino: "",
      opciones: ["", ""]
    });
    setShowConfirm(false);
    setSuccessMsg("Votación creada exitosamente ✔");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-votacion">
        {successMsg && (
          <div style={{
            background: "#e6ffe6",
            color: "#2e7d32",
            padding: "0.7em 1em",
            borderRadius: "6px",
            marginBottom: "1em",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            {successMsg}
          </div>
        )}
        <button className="cerrar-btn" onClick={onClose}>✖</button>
        <h3 className="modal-titulo">Crear nueva votación</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="titulo_votacion"
            placeholder="Título de la votación"
            value={form.titulo_votacion}
            onChange={handleChange}
            className="modal-input"
            required
          />
          <textarea
            name="descripcion_votacion"
            placeholder="Descripción"
            value={form.descripcion_votacion}
            onChange={handleChange}
            className="modal-input"
            rows={3}
          />
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>📅 Fecha</label>
              <input
                type="date"
                name="fecha_votacion"
                value={form.fecha_votacion}
                onChange={handleChange}
                className="modal-input"
                required
              />
            </div>
            <div>
              <label>🕒 Inicio</label>
              <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                className="modal-input"
                required
              />
            </div>
            <div>
              <label>🕒 Término</label>
              <input
                type="time"
                name="hora_termino"
                value={form.hora_termino}
                onChange={handleChange}
                className="modal-input"
                required
              />
            </div>
          </div>
          <div>
            <label>Opciones para votar:</label>
            <div className="opciones-scroll">
              {form.opciones.map((op, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={op}
                    onChange={e => handleOpcionChange(idx, e.target.value)}
                    className="modal-input"
                    placeholder={`Opción ${idx + 1}`}
                    required
                  />
                  {form.opciones.length > 1 && (
                    <button type="button" className="btn btn-danger" style={{marginLeft: 8}} onClick={() => eliminarOpcion(idx)}>🗑</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={agregarOpcion}>+ Agregar opción</button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">Confirmar</button>
            <button type="button" className="btn btn-danger" onClick={onClose}>Cancelar</button>
          </div>
        </form>
        {showConfirm && (
          <div className="modal-advertencia">
            <p style={{marginBottom: '1rem', color: '#b85c00', fontWeight: 500}}>
              Una vez creada la votación no se podrá hacer modificaciones.<br />
              <span style={{fontSize: '0.95em'}}>¿Estos valores son correctos?</span>
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button className="btn btn-primary" onClick={handleConfirmYes}>Sí</button>
              <button className="btn btn-danger" onClick={handleConfirmNo}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearVotacionModal;