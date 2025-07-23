import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getAllReuniones } from "@services/reuniones.service.js";
import "@styles/calendario.css";

const CalendarioReuniones = () => {
    const [reuniones, setReuniones] = useState([]);

    useEffect(() => {
    const fetchReuniones = async () => {
        const data = await getAllReuniones();
        const formateadas = data.map(r => {
        const horaInicio = r.hora_inicio?.slice(0, 5);
        return {
            title: `${horaInicio} ${r.descripcion_reunion}`,
            start: r.fecha_reunion, 
        };
    });
        setReuniones(formateadas);
    };
    fetchReuniones(); 
    }, []);
    
return (
    <div className="contenedor-calendario">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🗓️ Calendario de Reuniones</h2>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="es"
            events={reuniones}
            height="auto"
            buttonText={{
            today: "Hoy"
            }}
        />
    </div>
    );
};

export default CalendarioReuniones;
