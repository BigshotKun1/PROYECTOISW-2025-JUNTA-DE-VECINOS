/* import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getAllEventos, createEvento } from "@services/eventos.service.js"; // Ajusta la ruta según tu estructura
import "@styles/calendario.css";
import interactionPlugin from '@fullcalendar/interaction';


const CalendarioEventos = () => {
  const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);


  useEffect(() => {
    const fetchEventos = async () => {
      const eventosRaw = await getAllEventos();

      const eventosFormateados = eventosRaw.map(evento => {
        const start = `${evento.fechaEvento}T${evento.hora_inicio.slice(0,5)}`;
        const end = `${evento.fechaEvento}T${evento.hora_termino.slice(0,5)}`;

        return {
          title: evento.nombreEvento,
          start,
          end,
          extendedProps: {
            lugar: evento.lugar_evento,
            usuario: evento.usuario?.nombreCompleto || "Desconocido",
            periodo: evento.periodo
          }
        };
      });

      setEventos(eventosFormateados);
    };

    fetchEventos();
    
  }, []);

return (
    <div className="contenedor-calendario">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📅 Calendario de Eventos Vecinales</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        events={eventos}
        height="auto"
        eventClick={(info) => {
          const { title, start, end, extendedProps } = info.event;
          setEventoSeleccionado({
            title,
            fecha: start.toLocaleDateString(),
            horaInicio: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            horaTermino: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            lugar: extendedProps.lugar,
            organizador: extendedProps.usuario
          });
        }}
        dateClick={(info) => {
                abrirModalCrearEvento(info.dateStr);

        }}

      />

      {/* Modal a la derecha }/*
      {eventoSeleccionado && (
        <div className="modal-evento">
          <button onClick={() => setEventoSeleccionado(null)} className="cerrar-btn">X</button>
          <h3>{eventoSeleccionado.title}</h3>
          <p><strong>📅 Fecha:</strong> {eventoSeleccionado.fecha}</p>
          <p><strong>🕒 Hora:</strong> {eventoSeleccionado.horaInicio} - {eventoSeleccionado.horaTermino}</p>
          <p><strong>📍 Lugar:</strong> {eventoSeleccionado.lugar}</p>
          <p><strong>👤 Organizado por:</strong> {eventoSeleccionado.organizador}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarioEventos;
*/

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // <-- importante
import { getAllEventos, createEvento } from "@services/eventos.service.js";
import "@styles/calendario.css";

const CalendarioEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [nuevoEvento, setNuevoEvento] = useState({
    nombreEvento: "",
    hora_inicio: "",
    hora_termino: "",
    lugar_evento: ""
  });

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosRaw = await getAllEventos();

      const eventosFormateados = eventosRaw.map(evento => {
        const start = `${evento.fechaEvento}T${evento.hora_inicio.slice(0,5)}`;
        const end = `${evento.fechaEvento}T${evento.hora_termino.slice(0,5)}`;
        return {
          title: evento.nombreEvento,
          start,
          end,
          extendedProps: {
            lugar: evento.lugar_evento,
            usuario: evento.usuario?.nombreCompleto || "Desconocido",
            periodo: evento.periodo
          }
        };
      });

      setEventos(eventosFormateados);
    };

    fetchEventos();
  }, []);

  const handleDateClick = (info) => {
    setFechaSeleccionada(info.dateStr); // formato YYYY-MM-DD
    setModalAbierto(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento({ ...nuevoEvento, [name]: value });
  };

  const handleGuardarEvento = async () => {
    const eventoAEnviar = {
      ...nuevoEvento,
      fechaEvento: fechaSeleccionada,
      id_usuario: JSON.parse(sessionStorage.getItem("usuario"))?.id_usuario
    };

    const [guardado, error] = await createEvento(eventoAEnviar);

    if (guardado) {
      alert("✅ Evento creado correctamente");
      setModalAbierto(false);
      setNuevoEvento({
        nombreEvento: "",
        hora_inicio: "",
        hora_termino: "",
        lugar_evento: ""
      });
      // recargar eventos
      const actualizados = await getAllEventos();
      const eventosFormateados = actualizados.map(evento => ({
        title: evento.nombreEvento,
        start: `${evento.fechaEvento}T${evento.hora_inicio.slice(0,5)}`,
        end: `${evento.fechaEvento}T${evento.hora_termino.slice(0,5)}`,
        extendedProps: {
          lugar: evento.lugar_evento,
          usuario: evento.usuario?.nombreCompleto || "Desconocido",
          periodo: evento.periodo
        }
      }));
      setEventos(eventosFormateados);
    } else {
      alert("❌ Error al crear evento: " + error);
    }
  };

  return (
    <div className="contenedor-calendario">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📅 Calendario de Eventos Vecinales</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        events={eventos}
        height="auto"
        dateClick={handleDateClick}
      />

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nuevo evento para el {fechaSeleccionada}</h3>
            <input
              type="text"
              name="nombreEvento"
              placeholder="Nombre del evento"
              value={nuevoEvento.nombreEvento}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lugar_evento"
              placeholder="Lugar del evento"
              value={nuevoEvento.lugar_evento}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="hora_inicio"
              value={nuevoEvento.hora_inicio}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="hora_termino"
              value={nuevoEvento.hora_termino}
              onChange={handleInputChange}
            />

            <button onClick={handleGuardarEvento}>Guardar</button>
            <button onClick={() => setModalAbierto(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioEventos;
