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

  const hoy = new Date();
  const now = new Date(); // momento actual
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  // Filtrar eventos para hoy que aún no han terminado
  const eventosHoy = eventos.filter(ev => {
    // ¿Es de hoy?
    if (ev.fechaEvento !== hoyStr) return false;

    // Hora de término como Date completa (en la fecha de hoy)
    const endDate = new Date(`${ev.fechaEvento}T${ev.hora_termino}`);
    return endDate > now;
  });

  // Filtrar eventos para los próximos 14 días (igual que antes)
  const eventosProximos = eventos.filter(ev => {
    const fechaEvento = new Date(ev.fechaEvento);
    const fechaUTC = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
    const hoyUTC   = new Date(hoy.getFullYear(),     hoy.getMonth(),     hoy.getDate());
    const diffDias = (fechaUTC - hoyUTC) / (1000 * 60 * 60 * 24);
    return diffDias >= 0 && diffDias <= 14;
  });

  // Función para formatear hora sin segundos
  const formatoHora = (horaStr) => {
    const fecha = new Date(`1970-01-01T${horaStr}`);
    return fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="contenedor-principal">
      <div className="panel-lateral">
        <h2>
          {hoy.toLocaleDateString('es-CL', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </h2>

        <h3>📌 Eventos de Hoy</h3>
        {eventosHoy.length > 0 ? (
          eventosHoy.map(ev => (
            <div key={ev.id_evento}>
              <p>
                🚨 {ev.nombreEvento}, 🕑 {formatoHora(ev.hora_inicio)} - {formatoHora(ev.hora_termino)}
              </p>
            </div>
          ))
        ) : (
          <p>Sin eventos hoy</p>
        )}

        <h3 style={{ marginTop: '20px' }}>🗓️ Próximos eventos</h3>
        {eventosProximos.length > 0 ? (
          eventosProximos.map(ev => (
            <p key={ev.id_evento}>
              📍 {ev.nombreEvento} ➡️ {new Date(ev.fechaEvento).toLocaleDateString('es-CL')}
            </p>

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
