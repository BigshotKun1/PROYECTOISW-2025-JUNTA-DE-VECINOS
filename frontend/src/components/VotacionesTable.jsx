import { useEffect, useState } from 'react';
import '@styles/VotacionesTable.css';
import CrearVotacionModal from './CrearVotacionModal';
// Importa tu modal de detalle (deberás crearlo)
import DetalleVotacionModal from './DetalleVotacionModal';
import { getVotaciones, crearVotacion, eliminarVotacion } from '@services/votaciones.service.js';

function VotacionesTable() {
  const [votaciones, setVotaciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Paso 1: Estado para detalle
  const [votacionSeleccionada, setVotacionSeleccionada] = useState(null);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  useEffect(() => {
    const fetchVotaciones = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getVotaciones();
        setVotaciones(data);
      } catch (e) {
        setError('No se pudieron cargar las votaciones');
      } finally {
        setLoading(false);
      }
    };
    fetchVotaciones();
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    setUsuario(user);
  }, []);

  const rolesDirectiva = ['Administrador', 'Presidente', 'Secretario', 'Tesorero'];
  const puedeCrear = usuario && rolesDirectiva.includes(usuario.rol);

  const handleConfirmar = async (form) => {
    try {
      await crearVotacion(form);
      setModalAbierto(false);
      setLoading(true);
      const data = await getVotaciones();
      setVotaciones(data);
    } catch (e) {
      alert('Error al crear la votación');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarVotacion = async (id_votacion) => {
  if (window.confirm("¿Seguro que deseas eliminar esta votación?")) {
    console.log("Eliminando votación:", id_votacion);
    try {
      await eliminarVotacion(id_votacion);
      setDetalleAbierto(false);
      setLoading(true);
      const data = await getVotaciones();
      setVotaciones(data);
      setLoading(false);
      console.log("Votación eliminada");
    } catch (error) {
      alert("Error al eliminar la votación");
      console.error(error);
    }
  }
};

  // Paso 2: Función para saber si la votación está activa
  function estaActiva(votacion) {
    const ahora = new Date();
    const inicio = new Date(`${votacion.fecha_votacion}T${votacion.hora_inicio}`);
    const termino = new Date(`${votacion.fecha_votacion}T${votacion.hora_termino}`);
    return ahora >= inicio && ahora <= termino;
  }

  return (
    <div className="votaciones-table-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Votaciones</h2>
        {puedeCrear && (
          <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
            <span style={{ fontSize: "1.2em" }}>➕</span> Crear votación
          </button>
        )}
      </div>
      {loading ? (
        <div>Cargando votaciones...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table className="votaciones-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha de Votación</th>
              <th>Hora de Inicio</th>
              <th>Hora de Término</th>
            </tr>
          </thead>
          <tbody>
            {votaciones.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No hay votaciones registradas.</td>
              </tr>
            ) : (
              votaciones.map(v => (
                // Paso 3: Fila clickeable
                <tr
                  key={v.id_votacion}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setVotacionSeleccionada(v);
                    setDetalleAbierto(true);
                  }}
                >
                  <td>{v.titulo_votacion}</td>
                  <td>{v.descripcion_votacion}</td>
                  <td>{new Date(v.fecha_votacion).toLocaleDateString()}</td>
                  <td>{v.hora_inicio}</td>
                  <td>{v.hora_termino}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <CrearVotacionModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={handleConfirmar}
      />
      {/* Modal de detalle */}
      {detalleAbierto && votacionSeleccionada && (
        <DetalleVotacionModal
          votacion={votacionSeleccionada}
          abierta={estaActiva(votacionSeleccionada)}
          onClose={() => setDetalleAbierto(false)}
          onEliminar={handleEliminarVotacion}
        />
      )}
    </div>
  );
}

export default VotacionesTable;