const ListaAsistencias = ({ asistencias, onUpdate }) => {
    return (
        <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "8px", width: "70%" }}>Nombre</th>
                        <th style={{ textAlign: "left", padding: "8px", width: "30%" }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencias.map(a => (
                        <tr key={a.id_asistencia_reunion}>
                            <td style={{ padding: "8px" }}>
                                {a.id_usuario?.nombreCompleto.toUpperCase()}
                            </td>
                            <td style={{ padding: "8px" }}>
                                <select
                                    value={a.id_estado_asistencia.id_estado_asistencia}
                                    onChange={(e) =>
                                        onUpdate(a.id_asistencia_reunion, e.target.value)
                                    }
                                >
                                    <option value="1">Ausente</option>
                                    <option value="2">Presente</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaAsistencias;
