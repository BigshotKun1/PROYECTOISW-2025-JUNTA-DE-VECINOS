import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { createReuniones, deleteMeetingById } from "@services/reuniones.service.js";
import EstadisticasReuniones from "@components/graficosReuniones.jsx";
import "@styles/calendario.css";
import { deleteDataAlert, showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

const CalendarioReuniones = ({ reuniones, fetchReuniones }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalGraph, setMostrarModalGraph] = useState(false);
    const [newReunion, setNewReunion]= useState({
        descripcion_reunion:"",
        lugar_reunion:"",
        hora_inicio:"",
        hora_termino:"",
        fecha_reunion:"",
    })
    const [modoEliminar, setModoEliminar] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("usuario"))
    const autorizado = user?.rol === "Administrador" || user?.rol === "Presidente"|| user?.rol === "Tesorero"|| user?.rol === "Secretario";

    const navigate = useNavigate();

    const handleSubmit = async (e) => {        
        e.preventDefault();
        try {
            const formattedData = {
                descripcion_reunion: newReunion.descripcion_reunion,
                lugar_reunion: newReunion.lugar_reunion,
                hora_inicio: newReunion.hora_inicio,
                hora_termino: newReunion.hora_termino,
                fecha_reunion: newReunion.fecha_reunion
            };
            const [, error] = await createReuniones(formattedData);
            if (error) {
                showErrorAlert("Error al crear reunión", error.message);
                return;
            }
            await fetchReuniones(); 
            setNewReunion({ descripcion_reunion: '', lugar_reunion: '', hora_inicio: '', hora_termino: '', fecha_reunion: '' });
            setMostrarModal(false); 
            showSuccessAlert("¡Reunión creada!", "La reunión ha sido creada exitosamente");
        } catch (e) {
            console.error("error:",e);
            showErrorAlert("Error inesperado", "Ocurrió un error al crear la reunión.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('cambios realizados')
        setNewReunion((prevData) => ({ ...prevData, [name]: value }));
    }

    useEffect(() => {
        fetchReuniones(); 
    }, []);
    

    const customButtons = autorizado? {
        crearReunion: {
            text: "Crear Reunión",
            click: () => setMostrarModal(!mostrarModal),
        },
        eliminarReunion: {
            text: modoEliminar ? "❌ Cancelar" : "🗑 Eliminar",
            click: () => setModoEliminar(!modoEliminar),
        },
        graficas:{
            text:"Gráficas",
            click: () => setMostrarModalGraph(!mostrarModalGraph)
        }
    }: {};
    
    const handleEventClick = async (info) => {
        if (modoEliminar) {
            try {
                const result = await deleteDataAlert();
                
                if (result.isConfirmed) {
                    const [, err] = await deleteMeetingById(info.event.id);
                    await fetchReuniones(); 
                    
                    if (err) {
                        showErrorAlert("Error al eliminar", "No se pudo eliminar la reunión. Inténtalo nuevamente.");
                    } else {
                        showSuccessAlert("¡Eliminada!", "La reunión se eliminó correctamente");
                    }
                }
            } catch (error) {
                console.error("Error al eliminar reunión:", error);
                showErrorAlert("Error inesperado", "Ocurrió un error al eliminar la reunión.");
            } finally {
                setModoEliminar(false);
            }
        } else {
            const eventId = info.event.id;
            navigate(`/reunion/${eventId}`);
        }
    };
return (
    <div className="contenedor-calendario">
        <div>            
                {mostrarModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Crear Reunión</h2>
                            
                            <form onSubmit={handleSubmit} style={{marginRight:"40px"}}>
                                <div style={{marginBottom:"10px"}}>
                                    <label>Descripción:</label>
                                    <input type="text" name="descripcion_reunion" value={newReunion.descripcion_reunion} onChange={handleInputChange} required />
                                </div>
                                    <div style={{marginBottom:"10px"}}>
                                        <label>Fecha reunión:</label>
                                        <input type="date" name="fecha_reunion"  value={newReunion.fecha_reunion} onChange={handleInputChange}   required />
                                    </div>
                                <div style={{marginBottom:"10px"}}>
                                    <label>Lugar:</label>
                                    <input type="text" name="lugar_reunion" value={newReunion.lugar_reunion} onChange={handleInputChange}  required />
                                </div>
                                
                                <div style={{marginBottom:"10px"}}>
                                    <label>Hora inicio:</label>
                                    <input type="time" name="hora_inicio"  value={newReunion.hora_inicio} onChange={handleInputChange}  required />
                                </div>
                                
                                <div style={{marginBottom:"10px"}}>
                                    <label>Hora termino:</label>
                                    <input type="time" name="hora_termino" value={newReunion.hora_termino} onChange={handleInputChange}  required />
                                </div>
                                
                                <div style={{ display: "flex", justifyContent: "flex-end",  gap: "90px", marginTop: "20px"}}>
                                    <button type="submit" style={{ alignSelf: "flex-end", padding: "8px 16px", background: "#003366",color: "white", border: "none", borderRadius: "5px",cursor: "pointer"}}>Guardar</button>
                                    <button type="button" onClick={() => setMostrarModal(false)} style={{ alignSelf: "flex-end", padding: "8px 16px", background: "#ccc",color: "#333", border: "none", borderRadius: "5px",cursor: "pointer"}} >Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        
                    {mostrarModalGraph && (
                        <div style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0, 0, 0, 0.4)", display: "flex", justifyContent: "center",alignItems: "center",zIndex: 1000,}}>
                            <div style={{ background: "white", padding: "20px", width: "90%", maxWidth: "1000px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "20px", maxHeight: "90vh", overflowY: "auto",}}>
                                <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Estadísticas de Reuniones</h2>
                                <EstadisticasReuniones />
                            <button onClick={() => setMostrarModalGraph(false)} style={{ alignSelf: "flex-end", padding: "8px 16px", background: "#003366",color: "white", border: "none", borderRadius: "5px",cursor: "pointer",}}>Cerrar</button>
                        </div>
                    </div>
                )}
                </div>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🗓️ Calendario de Reuniones</h2>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale="es"
                        events={reuniones}
                        height="auto"
                        eventClick={handleEventClick}
                        buttonText={{
                            today: "Hoy"
                        }}
                        customButtons={customButtons}
                        headerToolbar={{
                            left: "title",
                            center: "",
                            right: autorizado ? "eliminarReunion graficas crearReunion today prev next" : "today prev next"
                        }}
                    />
                </div>
    );
};

export default CalendarioReuniones;