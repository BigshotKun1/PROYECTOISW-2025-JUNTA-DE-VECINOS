import { useState,useEffect } from "react";
import { createDirectiva } from "@services/directiva.service.js";
import { getUsers } from "@services/user.service.js";
import { getPeriodos } from "../../services/directiva.service.js";
const DirectivaPage = () => {
  const [id_usuario, setIdUsuario] = useState("");
  const [id_rol, setRol] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [id_periodo, setIdPeriodo] = useState("");
  const [creandoPeriodo, setCreandoPeriodo] = useState(false);


    useEffect(() => {
    async function fetchUsuarios() {
      try {
        console.log("LLAMA AL SERVICE DEL FRONT");
        const data = await getUsers();
        setUsuarios(data);
        const periodos = await getPeriodos()
        setPeriodos(periodos);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    }

    fetchUsuarios();
  }, []);

  const handleCrear = async () => {
    try {
      await createDirectiva({ id_usuario, id_rol, fechaInicio, fechaTermino });
      // Limpia el formulario
      setIdUsuario("");
      setRol("");
      setFechaInicio("");
      setFechaTermino("");
    } catch (err) {
      console.error("Error al crear directiva:", err);
    }
  };

  return (
    <div className="container mt-4 mb-5"> 
    <div className="modal fade" id="crearModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Directiva</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Selecciona un usuario</label>
              <select className="form-select" value={id_usuario} onChange={(e) => setIdUsuario(e.target.value)}>
                <option value="">-- Selecciona un usuario --</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select name="id_rol" value={id_rol} onChange={(e) => setRol(e.target.value)} className="form-select">
                <option value="3">Presidente</option>
                <option value="4">Secretario</option>
                <option value="5">Tesorero</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Selecciona un periodo</label>
              <select className="form-select" value={id_periodo} onChange={(e) => setIdPeriodo(e.target.value)}>
                <option value="">-- Selecciona un periodo --</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id_periodo} value={periodo.id_periodo}>
                    {periodo.fechaInicio} — {periodo.fechaTermino}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Selecciona un periodo</label>
              <select
                className="form-select"
                value={id_periodo}
                onChange={(e) => {
                  setIdPeriodo(e.target.value);
                  setCreandoPeriodo(false);
                }}
              >
                <option value="">-- Selecciona un periodo --</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id_periodo} value={periodo.id_periodo}>
                    {periodo.fechaInicio} — {periodo.fechaTermino}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => {
                  setIdPeriodo("");
                  setCreandoPeriodo(true);
                }}
              >
                + Crear nuevo periodo
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={handleCrear} className="btn btn-success">Crear</button>
            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DirectivaPage;
