import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getAllEventos, createEvento, deleteEvento } from "@services/eventos.service.js";
import "@styles/calendario.css";
import Swal from 'sweetalert2';

const CalendarioEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombreEvento: "",
    hora_inicio: "",
    hora_termino: "",
    lugar_evento: ""
  });

  const [modoEliminar, setModoEliminar] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosRaw = await getAllEventos();

      const eventosFormateados = eventosRaw.map(evento => {
        const start = `${evento.fechaEvento}T${evento.hora_inicio.slice(0, 5)}`;
        const end = `${evento.fechaEvento}T${evento.hora_termino.slice(0, 5)}`;
        return {
          id: evento.id_evento.toString(),
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
    setFechaSeleccionada(info.dateStr);
    setModalAbierto(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento({ ...nuevoEvento, [name]: value });
  };

  const handleGuardarEvento = async () => {
    if (nuevoEvento.hora_termino <= nuevoEvento.hora_inicio) {
    return Swal.fire({
      icon: 'warning',
      title: 'Hora inválida',
      text: 'La hora de término no puede ser menor o igual a la de inicio.'
    });
  }
    const eventoAEnviar = {
      ...nuevoEvento,
      fechaEvento: fechaSeleccionada,
      id_usuario: JSON.parse(sessionStorage.getItem("usuario"))?.id_usuario
    };

    const [guardado, error] = await createEvento(eventoAEnviar);

    if (guardado) {
     Swal.fire({
    icon: 'success',
    title: 'Evento creado',
    text: '✅ Tu evento se ha guardado correctamente.',
    timer: 2000,
    showConfirmButton: false
  });
      setModalAbierto(false);
      setNuevoEvento({
        nombreEvento: "",
        hora_inicio: "",
        hora_termino: "",
        lugar_evento: ""
      });
      // Recargar eventos
      const actualizados = await getAllEventos();
      const eventosFormateados = actualizados.map(evento => ({
        id: evento.id_evento.toString(),
        title: evento.nombreEvento,
        start: `${evento.fechaEvento}T${evento.hora_inicio.slice(0, 5)}`,
        end: `${evento.fechaEvento}T${evento.hora_termino.slice(0, 5)}`,
        extendedProps: {
          lugar: evento.lugar_evento,
          usuario: evento.usuario?.nombreCompleto || "Desconocido",
          periodo: evento.periodo
        }
      }));
      setEventos(eventosFormateados);
    } else {
       Swal.fire({
    icon: 'error',
    title: 'Error',
    text: '❌ No se pudo crear el evento: ' + error,
  });
    }
  };

const handleEventClick = async (info) => {
  if (modoEliminar) {
    const result = await Swal.fire({
      title: `¿Estas seguro de que quieres eliminar el evento "${info.event.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const [res, err] = await deleteEvento(info.event.id);
      if (!err) {
        setEventos(prev => prev.filter(ev => ev.id !== info.event.id));
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: '✅ El evento ha sido eliminado.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ No se pudo eliminar el evento: ' + err.message
        });
      }
    }
    setModoEliminar(false);
  } else {
    // Mostrar detalles si no estás en modo eliminar
    const { title, start, end, extendedProps } = info.event;
    setEventoSeleccionado({
      title,
      fecha: start.toLocaleDateString(),
      horaInicio: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      horaTermino: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      lugar: extendedProps.lugar,
      organizador: extendedProps.usuario
    });
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
  eventClick={handleEventClick}
  customButtons={{
    eliminarEvento: {
      text: modoEliminar ? "❌ Cancelar" : "🗑 Eliminar",
      click: () => setModoEliminar(!modoEliminar),
    }
  }}
  headerToolbar={{
    left: "prev,next today eliminarEvento",
    center: "title",
    right: ""
  }}
   buttonText={{
    today: "Hoy"
  }}
/>

{modalAbierto && (
  <div className="modal-overlay">
    <div className="modal modal-crear-evento">
      <h3 className="modal-titulo">Crear nuevo evento</h3>
      <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>📅 Fecha: {fechaSeleccionada}</p>

      <input
        type="text"
        name="nombreEvento"
        placeholder="Nombre del evento"
        value={nuevoEvento.nombreEvento}
        onChange={handleInputChange}
        className="modal-input"
      />
      <input
        type="text"
        name="lugar_evento"
        placeholder="Lugar"
        value={nuevoEvento.lugar_evento}
        onChange={handleInputChange}
        className="modal-input"
      />
      <div className="hora-container">
        <div>
          <label>🕒 Inicio</label>
          <input
            type="time"
            name="hora_inicio"
            value={nuevoEvento.hora_inicio}
            onChange={handleInputChange}
            className="modal-input"
          />
        </div>
        <div>
          <label>🕒 Término</label>
          <input
            type="time"
            name="hora_termino"
            value={nuevoEvento.hora_termino}
            onChange={handleInputChange}
            className="modal-input"
          />
        </div>
      </div>

      <div className="botones-modal">
        <button className="btn guardar" onClick={handleGuardarEvento}>Guardar</button>
        <button className="btn cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}


      {/* Modal VER DETALLE EVENTO */}
      {eventoSeleccionado && !modoEliminar && (
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
