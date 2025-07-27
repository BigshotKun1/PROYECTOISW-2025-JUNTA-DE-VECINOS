import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMeetingById , updateReunion} from "@services/reuniones.service.js";
import { getAsistenciasByReunion, updateAsistenciaEstado } from "@services/asistencia.service.js";
import ListaAsistencias from "@components/ListaAsistencias.jsx";
import '@styles/reuniondetalle.css';
import { uploadActaToMeeting } from "@services/reuniones.service.js";
import { Link } from "react-router-dom";

const ReunionDetalle = () => {
    const { id } = useParams();
    const [reunion, setReunion] = useState(null);
    const [asistencias, setAsistencias] = useState([]);
    const [, setPdfFile] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [formData, setFormData] = useState({
      descripcion_reunion: "",
      lugar_reunion: "",
      hora_inicio: "",
      hora_termino: "",
      fecha_reunion: "",
      id_estado:"",
      });
    const user = JSON.parse(sessionStorage.getItem("usuario"))
    const puedeEditarSubirActa = user?.rol === "Administrador" || user?.rol === "Presidente"|| user?.rol === "Tesorero"|| user?.rol === "Secretario";
    console.log("usuario",user)

    useEffect(() => {
    if (reunion) {
      setFormData({
        descripcion_reunion: reunion.descripcion_reunion || "",
        lugar_reunion: reunion.lugar_reunion || "",
        hora_inicio: (reunion.hora_inicio || "").slice(0, 5),
        hora_termino: (reunion.hora_termino || "").slice(0, 5),
        fecha_reunion: reunion.fecha_reunion || "",
        id_estado: reunion.estado?.id_estado || "",
        });
      }
    }, [reunion]);

    const reunionId = parseInt(id); 

    useEffect(() => {
      const fetchData = async () => {
        const reunionData = await getMeetingById(reunionId);
        const lista = await getAsistenciasByReunion(reunionId);
        lista.sort((a, b) => a.id_usuario.nombreCompleto.localeCompare(b.id_usuario.nombreCompleto));
        setReunion(reunionData);
        setAsistencias(lista);
        };
      fetchData();
    }, [reunionId]);

    const handleEditarSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log("lo que mando al backend",formData)
        await updateReunion(reunion.id_reunion, formData);
        const updated = await getMeetingById(reunion.id_reunion);
        setReunion(updated);
        alert("✅ Reunión actualizada correctamente");
        setMostrarModal(false);

      } catch (error) {
        console.error("Error actualizando reunión:", error);
        alert("❌ Error al actualizar");
      }
    };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handlePdfChange = (e) => {
      const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
          setPdfFile(URL.createObjectURL(file)); // para previsualizar
          setSelectedPdf(file); // para subir
        } else {
          alert("Solo se permiten archivos PDF.");
        }
    };

    const handleUploadPdf = async () => {
      if (!selectedPdf) return alert("Primero selecciona un archivo PDF.");
        const [, err] = await uploadActaToMeeting(reunion.id_reunion, selectedPdf);
          if (!err) {
            alert("✅ Acta subida correctamente.");
            const updated = await getMeetingById(reunion.id_reunion);
            setReunion(updated);
            setSelectedPdf(null);
          } else {
            alert("❌ Error al subir el acta.");
          }
      };
      
      if (!reunion) return <p>Cargando reunión...</p>;
    
    return (
      <div className="contenedor-detalle">
        <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>

              <Link to={`/reuniones`}>
                <button style={{ backgroundColor: "#003366", padding: "4px 12px", borderRadius: "6px", color: "white" }}>Volver</button>
              </Link> 

              <h2 style={{flexGrow: 1, textAlign: "center"}}>Detalles de la Reunión</h2>
              
            </div>

            <p><strong>Descripción:</strong> {reunion.descripcion_reunion}</p>
            <p><strong>Fecha:</strong> { reunion.fecha_reunion.split('-').reverse().join('-')}</p>

            <p><strong>Lugar:</strong> {reunion.lugar_reunion}</p>
            <p><strong>Hora Inicio:</strong> {reunion.hora_inicio}</p>
            <p><strong>Hora Término:</strong> {reunion.hora_termino}</p>
            <p><strong>Estado:</strong> {reunion.estado?.nombreEstado}</p>
            
            {puedeEditarSubirActa && (<button type="button" onClick={() => setMostrarModal(!mostrarModal)} style={{ backgroundColor: "#003366", padding: "4px 12px", borderRadius: "6px", color: "white" }} >Editar</button>)}
            {mostrarModal && (
              <div className="modal-overlay">
                <div style={{background:"white",padding: "50px", width: "300px", borderRadius: "10px",display:"flex", flexDirection:"column", gap:"10px"}}>
                  <h3>Editar Reunión</h3>
                  
                  <form onSubmit={handleEditarSubmit}>
                    <div style={{marginRight:"40px"}}>
                      <div style={{marginBottom:"10px"}}>
                        <label>Descripción:</label>
                        <input type="text" name="descripcion_reunion" value={formData.descripcion_reunion} onChange={handleChange}/>
                      </div>
                      
                      <div style={{marginBottom:"13px"}}>
                        <label>Fecha:</label>
                        <input type="date" name="fecha_reunion" value={formData.fecha_reunion} onChange={handleChange}/>
                      </div>

                      <div style={{marginBottom:"13px"}}>
                        <label>Lugar Reunion:</label>
                        <input type="text" name="lugar_reunion" value={formData.lugar_reunion} onChange={handleChange}/>
                      </div>

                      <div style={{marginBottom:"13px"}}>
                        <label>Hora Inicio:</label>
                        <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange}/>
                      </div>

                      <div style={{marginBottom:"13px"}}>
                        <label>Hora Termino:</label>
                        <input type="time" name="hora_termino" value={formData.hora_termino} onChange={handleChange}/>
                      </div>

                      <div style={{ marginBottom: "13px" }}>
                        <label>Estado:</label>
                        <select name="id_estado" value={formData.id_estado} onChange={handleChange}>
                          <option value="1">Pendiente</option>
                          <option value="2">Suspendida</option>
                          <option value="3">Realizada</option>
                        </select>
                      </div>

                      
                      <button type="submit">Guardar Cambios</button>
                      <button onClick={() => setMostrarModal(false)} type="button">Cancelar</button>
                    </div>    
                  </form>
                </div>
              </div>
            )}

        </div>
        
        {puedeEditarSubirActa&& (
          <>
            <h3>📋 Lista de Asistencias</h3>
                <ListaAsistencias asistencias={asistencias} onUpdate={async (idAsistencia, nuevoEstado) => {
                  const [, err] = await updateAsistenciaEstado(idAsistencia, nuevoEstado);
                  if (!err) {
                    const nuevas = await getAsistenciasByReunion(reunionId);
                    nuevas.sort((a, b) => a.id_usuario.nombreCompleto.localeCompare(b.id_usuario.nombreCompleto));
                    setAsistencias(nuevas);
                  }
                }}/>

            <div className="upload-section">
              <h3>📄 Acta de Reunión (PDF)</h3>
                <div style={{display:"grid",alignItems: "center", gap: "8px" }}>

                  
                    <>
                      <input type="file" accept="application/pdf" onChange={handlePdfChange} />
                      <button onClick={handleUploadPdf}>Subir Acta</button>
                    </>
                  

                </div>
            </div>
          </>
        )}
      
      {reunion.acta_pdf && !selectedPdf && (
        <div className="pdf-viewer">
          <embed
            src={`http://localhost:3000${reunion.acta_pdf}`}
            type="application/pdf"
            />
          </div>
        )}
      </div>
    );
};

export default ReunionDetalle;
