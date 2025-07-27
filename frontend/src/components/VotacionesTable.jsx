import { useEffect, useState } from 'react';
import '@styles/VotacionesTable.css';
import CrearVotacionModal from './CrearVotacionModal';
import { getVotaciones, crearVotacion } from '@services/votaciones.service.js';

function VotacionesTable() {
  const [votaciones, setVotaciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                <tr key={v.id_votacion}>
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
    </div>
  );
}

export default VotacionesTable;