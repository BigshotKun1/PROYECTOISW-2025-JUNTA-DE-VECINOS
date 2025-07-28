import { useEffect, useState } from 'react';
import { getAllDirectiva } from '@services/directiva.service.js';

const useDirectiva = () => {
  const [directiva, setDirectiva] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDirectiva = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDirectiva();
      // Validar que data sea un array
      if (Array.isArray(data)) {
        setDirectiva(data);
      } else {
        setError(data?.message || "Error al obtener directiva");
      }
    } catch (err) {
      setError(err.message || "Error inesperado");
      console.error("Error en fetchDirectiva:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectiva();
  }, []);

  return { directiva, setDirectiva, fetchDirectiva, loading, error };
};

export default useDirectiva;
