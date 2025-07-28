import { useState } from "react";
import axios from "axios";

export const useDeleteDirectiva = (onDeleted) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (miembrosSeleccionados) => {
    if (!miembrosSeleccionados || miembrosSeleccionados.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Por ejemplo, eliminar varios miembros en batch
      await Promise.all(
        miembrosSeleccionados.map(miembro =>
          axios.delete(`/api/directiva/${miembro.id_miembro}`)
        )
      );
      if (onDeleted) onDeleted();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleDelete };
};
