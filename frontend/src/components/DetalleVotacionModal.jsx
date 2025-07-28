import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import '@styles/DetalleVotacionModal.css';
import { emitirVoto, verificarUsuarioYaVoto } from '@services/votaciones.service.js';
Chart.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#1976d2", "#388e3c", "#fbc02d", "#d32f2f", "#7b1fa2", "#0097a7", "#c2185b"
];
const rolesDirectiva = ['Administrador', 'Presidente', 'Secretario', 'Tesorero'];

const DetalleVotacionModal = ({ votacion, abierta, onClose, onEliminar }) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [yaVoto, setYaVoto] = useState(false);
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));

  // Calcular si la votación aún no ha iniciado
  const ahora = new Date();
  const fechaInicio = new Date(votacion.fecha_votacion + "T" + votacion.hora_inicio);
  const votacionNoIniciada = ahora < fechaInicio;

  useEffect(() => {
    setResultados(votacion.votos
      ? votacion.opciones.map((_, idx) =>
          votacion.votos.filter(v => v.opcion_index === idx).length
        )
      : votacion.opciones.map(() => 0)
    );
  }, [votacion]);

  // Consultar si el usuario ya votó
  useEffect(() => {
  const fetchYaVoto = async () => {
    if (usuario && usuario.id_usuario) {
      const yaVotoBackend = await verificarUsuarioYaVoto(votacion.id_votacion, usuario.id_usuario);
      setYaVoto(yaVotoBackend);
    } else {
      setYaVoto(false); // O maneja el caso de usuario no autenticado
    }
  };
  fetchYaVoto();
}, [votacion, usuario]);

  const handleVotar = async () => {
    if (opcionSeleccionada !== null) {
      try {
        await emitirVoto(votacion.id_votacion, opcionSeleccionada);
        alert("Voto emitido con éxito");
        setYaVoto(true); // Actualiza el estado local
      } catch (error) {
        let backendMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Error al emitir el voto";
        if (
          backendMsg.includes("Ya has votado en esta votación") ||
          backendMsg.includes("Ya has votado")
        ) {
          backendMsg = "Ya ha votado en esta votación";
          setYaVoto(true); // Actualiza el estado local si el backend lo rechaza
        }
        alert(backendMsg);
        console.error(error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-votacion">
        <button className="cerrar-btn" onClick={onClose}>✖</button>
        <div style={{ marginBottom: "0.5em", fontWeight: "bold", color: "#1976d2" }}>
          {new Date(votacion.fecha_votacion).toLocaleDateString()} | Inicio: {votacion.hora_inicio} | Término: {votacion.hora_termino}
        </div>
        <h3 className="modal-titulo">{votacion.titulo_votacion}</h3>
        <p style={{ marginBottom: "1em", color: "#444" }}>{votacion.descripcion_votacion}</p>
        {votacionNoIniciada ? (
          <div style={{ margin: "2em 0", textAlign: "center", color: "#888", fontWeight: "bold" }}>
            Esta votación todavía no ha empezado
          </div>
        ) : abierta && !yaVoto ? (
          <>
            <h4>Opciones:</h4>
            <div className="opciones-container">
              {votacion.opciones.map((op, idx) => (
                <label key={idx} className="opcion-voto">
                  <input
                    type="radio"
                    name="opcion"
                    value={idx}
                    checked={opcionSeleccionada === idx}
                    onChange={() => setOpcionSeleccionada(idx)}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>
            <button
              className="btn btn-primary"
              disabled={opcionSeleccionada === null}
              onClick={handleVotar}
            >
              Votar
            </button>
          </>
        ) : abierta && yaVoto ? (
          <div style={{ margin: "2em 0", textAlign: "center", color: "#888", fontWeight: "bold" }}>
            Ya has votado en esta votación, una vez finalizada se mostrarán los resultados
          </div>
        ) : (
          <>
            <h4 style={{ marginBottom: "1em" }}>Resultados:</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "2em" }}>
              <div style={{ width: "180px", height: "180px" }}>
                <Pie
                  data={{
                    labels: votacion.opciones,
                    datasets: [{
                      data: resultados,
                      backgroundColor: COLORS.slice(0, votacion.opciones.length),
                      borderWidth: 2,
                    }]
                  }}
                  options={{
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
              <div>
                {votacion.opciones.map((op, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.7em" }}>
                    <span style={{
                      display: "inline-block",
                      width: 18,
                      height: 18,
                      background: COLORS[idx % COLORS.length],
                      borderRadius: "50%",
                      marginRight: 10,
                      border: "2px solid #eee"
                    }}></span>
                    <span style={{ fontWeight: 500 }}>{op}</span>
                    <span style={{ marginLeft: 10, color: "#1976d2", fontWeight: 600 }}>
                      {resultados[idx]} voto{resultados[idx] === 1 ? "" : "s"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Botón eliminar solo para directiva */}
        {usuario && rolesDirectiva.includes(usuario.rol) && (
          <button
            className="btn btn-danger"
            style={{ marginTop: "2em", width: "100%" }}
            onClick={() => onEliminar(votacion.id_votacion)}
          >
            Eliminar votación
          </button>
        )}
      </div>
    </div>
  );
};

export default DetalleVotacionModal;