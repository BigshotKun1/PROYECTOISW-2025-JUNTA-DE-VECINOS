import CalendarioEventos from "../components/Calendario.jsx";
import { useEffect, useState } from "react";
import axios from "@services/root.service.js"; 
import '@styles/Eventos.css'; 

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
 

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("/eventos");
        setEventos(response.data.data || []);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  // Filtrar eventos para hoy
const hoy = new Date(); // Esto sí es una Date válida
const hoyStr = hoy.toISOString().split("T")[0]; // Esto es el string 'YYYY-MM-DD'
const eventosHoy = eventos.filter(evento => evento.fechaEvento === hoyStr);
// Filtrar eventos para los próximos 14 días
const eventosProximos = eventos.filter(ev => {
  const fechaEvento = new Date(ev.fechaEvento);

  const fechaEventoUTC = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
  const hoyUTC = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  const diferenciaEnDias = (fechaEventoUTC - hoyUTC) / (1000 * 60 * 60 * 24);

  return diferenciaEnDias >= 0 && diferenciaEnDias <= 14;
});

  return (
    <div className="contenedor-principal">
      <div className="panel-lateral">
        <h2>{hoy.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        <h3>📌 Eventos de Hoy</h3>
        {eventosHoy.length > 0 ? (
  eventosHoy.map(ev => {
    const inicio = new Date(`1970-01-01T${ev.hora_inicio}`);
    const termino = new Date(`1970-01-01T${ev.hora_termino}`);

    const formatoHora = (fecha) =>
      fecha.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

    return (
      <div key={ev.id_evento}>
        <p>🚨 {ev.nombreEvento}, 🕑 {formatoHora(inicio)} - {formatoHora(termino)}</p>

      </div>
    );
  })
) : (
  <p>Sin eventos hoy</p>
)}

        <h3 style={{ marginTop: '20px' }}>🗓️ Próximos eventos</h3>
        {eventosProximos.length > 0 ? (
          eventosProximos.map(ev => (
            <p key={ev.id_evento}>📍 {ev.nombreEvento} ➡️ {new Date(ev.fechaEvento).toLocaleDateString()}</p>
          ))
        ) : (
          <p>No hay eventos en los próximos días</p>
        )}
      </div>

      <div className="panel-calendario">
        <CalendarioEventos />
      </div>
    </div>
  );
};

export default Eventos;
