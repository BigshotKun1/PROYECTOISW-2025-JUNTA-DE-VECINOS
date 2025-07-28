import React from 'react';

const TablaDirectiva = ({ miembros = [], onAddClick }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Miembros de la Directiva</h2>
        <button onClick={onAddClick} className="text-green-600 text-2xl">＋</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Periodo</th>
          </tr>
        </thead>
        <tbody>
          {miembros.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">No hay miembros para mostrar.</td>
            </tr>
          ) : (
            miembros.map((miembro) => (
              <tr key={miembro.id}>
                <td>{miembro.usuario.rut}</td>
                <td>{miembro.usuario.nombreCompleto}</td>
                <td>{miembro.rol.nombre}</td>
                <td>{miembro.periodo.fecha_inicio} - {miembro.periodo.fecha_termino}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDirectiva;
