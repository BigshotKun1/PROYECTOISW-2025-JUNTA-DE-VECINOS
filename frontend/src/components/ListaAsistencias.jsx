const ListaAsistencias = ({ asistencias, onUpdate }) => {
    return (
        <div>
            {asistencias.map(a => (
                <div key={a.id_asistencia_reunion} className="fila-asistencia">
                    <span>{a.id_usuario?.nombreCompleto.toUpperCase()}</span>
                    <select
                        value={a.id_estado_asistencia.id_estado_asistencia}
                        onChange={(e) =>
                        onUpdate(a.id_asistencia_reunion, e.target.value)
                        }
                    >
                        <option value="1">Ausente</option>
                        <option value="2">Presente</option>
                    </select>
                </div>
            ))}
        </div>
    );
};

export default ListaAsistencias;
