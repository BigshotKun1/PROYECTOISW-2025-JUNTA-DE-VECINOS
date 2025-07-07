import { useEffect, useState } from 'react';
import { getVotaciones } from '@services/votaciones.service.js';

function VotacionesTable() {
  const [votaciones, setVotaciones] = useState([]);

  useEffect(() => {
    getVotaciones().then(setVotaciones);
  }, []);

  return (
    <div>
      <h2>Votaciones</h2>
      <table>
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
          {votaciones.map(v => (
            <tr key={v.id_votacion}>
              <td>{v.titulo_votacion}</td>
              <td>{v.descripcion_votacion}</td>
              <td>{new Date(v.fecha_votacion).toLocaleDateString()}</td>
              <td>{v.hora_inicio}</td>
              <td>{v.hora_termino}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VotacionesTable;