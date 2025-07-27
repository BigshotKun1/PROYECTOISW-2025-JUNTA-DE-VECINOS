import { useState, useEffect } from "react";
import { getHistorial } from "@services/asistencia.service.js";
import '@styles/perfil.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false);
  const [historialAsistencia, setHistorialAsistencia] = useState([]);
  
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('usuario'));
    setUser(userData);
  }, []);

    const autorizado =  user?.rol === "Presidente"|| user?.rol === "Tesorero"|| user?.rol === "Secretario" || user?.rol === "Vecino";

  if (!user) return <p>Cargando perfil...</p>;

  const abrirModalHistorial = async () => {
  if (!user?.rut) return alert("RUT no disponible");

  try {
    const historial = await getHistorial(user.rut);
    setHistorialAsistencia(historial);
    setMostrarModalHistorial(true);
  } catch (error) {
    console.error("Error al cargar historial:", error);
    alert("❌ No se pudo cargar el historial de asistencias.");
  }
  };
  console.log("userData",user)
  console.log("certificado de residencia",user.certificadoResidencia_pdf)

  return (
    
    <div className="profile-container">
      <div className="profile-card">
        <img
          className="profile-image"
          src="/img/gojo.jpg"
          alt="Foto de perfil"
        />
        <div className="profile-details">
          <h2>{user.nombreCompleto}</h2>
          <p><strong>RUT:</strong> {user.rut}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {typeof user.rol === 'object' ? user.rol.nombreRol : user.rol}</p>
          <p><strong>Certificado de Residencia:</strong> {user.certificadoResidencia_pdf}</p>

          {autorizado && (<button onClick={abrirModalHistorial} style={{ marginTop: "20px", padding: "8px 16px", background: "#003366", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>Ver historial de asistencia</button>)}
          {mostrarModalHistorial && (
        <div className="modal-overlay"> 
          <div className="modal-content">
            <h2>📋 Historial de Asistencia</h2>
            
            {historialAsistencia.length > 0 ? (
              <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Fecha</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Descripcion</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Estado</th>
                  </tr>
                </thead>
              <tbody>
                {historialAsistencia.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{new Date(item.fecha).toLocaleDateString()}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.descripcion}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.estado}</td>
                  </tr>
                ))}
              </tbody>
              </table>
              ) : (
                <p>No hay historial de asistencia disponible.</p>
            )}
          <button onClick={() => setMostrarModalHistorial(false)} style={{ marginTop: "20px", padding: "8px 16px", background: "#ccc", color: "#333", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Cerrar
          </button>
        </div>
      </div>
      )}
        </div>
      </div>
    </div>

    
  );
};

export default UserProfile;
