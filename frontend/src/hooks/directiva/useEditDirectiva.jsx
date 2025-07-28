import { useState } from "react";
import axios from "axios";

export const useEditDirectiva = (onUpdated) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataMiembro, setDataMiembro] = useState(null);
  const [error, setError] = useState(null);

  const handleClickUpdate = (miembrosSeleccionados) => {
    if (miembrosSeleccionados.length === 1) {
      setDataMiembro(miembrosSeleccionados[0]);
      setIsPopupOpen(true);
      setError(null);
    } else {
      setError("Seleccione exactamente un miembro para editar.");
    }
  };

  const handleUpdate = async (updatedData) => {
    setError(null);
    try {
      await axios.put(`/api/directiva/${updatedData.id_miembro}`, updatedData);
      setIsPopupOpen(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return {
    isPopupOpen,
    setIsPopupOpen,
    dataMiembro,
    setDataMiembro,
    error,
    handleClickUpdate,
    handleUpdate,
  };
};
