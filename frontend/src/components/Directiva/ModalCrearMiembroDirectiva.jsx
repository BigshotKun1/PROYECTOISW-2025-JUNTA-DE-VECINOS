import { useState } from "react";
import { createDirectiva } from "@services/directiva.service.js";

const DirectivaPage = () => {
  const [rut, setRut] = useState("");
  const [rol, setRol] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");

  const handleCrear = async () => {
    try {
      await createDirectiva({ rut, rol, fechaInicio, fechaTermino });
      // Limpia el formulario
      setRut("");
      setRol("");
      setFechaInicio("");
      setFechaTermino("");
      // Cierra el modal
      const modalElement = document.getElementById("crearModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      // Opcional: recargar datos
    } catch (err) {
      console.error("Error al crear directiva:", err);
    }
  };

  return (
    <div className="container mt-4">
      {/* Modal Bootstrap */}
      <div className="modal fade" id="crearModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear Directiva</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">RUT</label>
                <input
                  type="text"
                  className="form-control"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <input
                  type="text"
                  className="form-control"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha Término</label>
                <input
                  type="date"
                  className="form-control"
                  value={fechaTermino}
                  onChange={(e) => setFechaTermino(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCrear}
                className="btn btn-success"
              >
                Crear
              </button>
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectivaPage;
