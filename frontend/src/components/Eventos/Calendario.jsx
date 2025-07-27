import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getAllEventos, createEvento, deleteEvento, updateEvento } from "@services/eventos.service.js";
import ModalCrearEvento from "@components/Eventos/ModalCrearEvento.jsx";
import ModalDetalleEvento from "@components/Eventos/ModalDetalleEvento.jsx";
import "@styles/calendario.css";
import Swal from 'sweetalert2';

const CalendarioEventos = ({ onEventoCreado }) => {
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
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoEditandoId, setEventoEditandoId] = useState(null);


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
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento({ ...nuevoEvento, [name]: value });
  };

  const handleGuardarEvento = async () => {
  if (nuevoEvento.hora_termino <= nuevoEvento.hora_inicio) {
    return Swal.fire({ icon: 'warning', title: 'Hora inválida', text: 'La hora de término no puede ser menor o igual a la de inicio.' });
  }

  const eventoAEnviar = {
    ...nuevoEvento,
    fechaEvento: fechaSeleccionada,
    id_usuario: JSON.parse(sessionStorage.getItem("usuario"))?.id_usuario
  };

  let guardado, error;

  if (modoEdicion) {
    [guardado, error] = await updateEvento(eventoEditandoId, eventoAEnviar);
  } else {
    [guardado, error] = await createEvento(eventoAEnviar);
  }

  if (guardado) {
    Swal.fire({
      icon: 'success',
      title: modoEdicion ? 'Evento actualizado' : 'Evento creado',
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
    setModoEdicion(false);
    setEventoEditandoId(null);

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

    if (onEventoCreado) onEventoCreado();
  } else {
    Swal.fire({ icon: 'error', title: 'Error', text: '❌ No se pudo guardar el evento: ' + error });
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
          if (onEventoCreado) onEventoCreado(); // También actualizar tabla al eliminar
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
        id: info.event.id,
        title,
        fecha: start.toLocaleDateString(),
        horaInicio: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        horaTermino: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        lugar: extendedProps.lugar,
        organizador: extendedProps.usuario
      });
    }
  };

  const handleEditarEvento = () => {
  setModalAbierto(true);
  setModoEdicion(true);
  setEventoEditandoId(eventoSeleccionado.id);

  setNuevoEvento({
    nombreEvento: eventoSeleccionado.title,
    hora_inicio: eventoSeleccionado.horaInicio,
    hora_termino: eventoSeleccionado.horaTermino,
    lugar_evento: eventoSeleccionado.lugar
  });

  setFechaSeleccionada(eventoSeleccionado.fecha);
  setEventoSeleccionado(null); // cerrar modal de detalle
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
  <ModalCrearEvento
    fecha={fechaSeleccionada}
    evento={nuevoEvento}
    onChange={handleInputChange}
    onGuardar={handleGuardarEvento}
    onCancelar={() => setModalAbierto(false)}
    modoEdicion={modoEdicion}
  />
)}

{eventoSeleccionado && !modoEliminar && (
  <ModalDetalleEvento
    evento={eventoSeleccionado}
    onClose={() => setEventoSeleccionado(null)}
    onEditar={handleEditarEvento}
  />
)}
    </div>
  );
};

export default CalendarioEventos;
