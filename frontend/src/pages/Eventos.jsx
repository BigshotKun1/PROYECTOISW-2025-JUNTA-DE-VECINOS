import CalendarioEventos from "../components/Eventos/Calendario.jsx";
import PanelLateralEventos from "../components/Eventos/PanelLateralEventos.jsx";
import { useEffect, useState } from "react";
import axios from "@services/root.service.js";
import '@styles/Eventos.css';
import { getAllEventos } from "../services/eventos.service.js";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);

  const fetchEventos = async () => {
    try {
      const eventosData = await getAllEventos();
      setEventos(eventosData || []);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div className="contenedor-principal">
      <PanelLateralEventos eventos={eventos} />
      <div className="panel-calendario">
        <CalendarioEventos onEventoCreado={fetchEventos} />
      </div>
    </div>
  );
};

export default Eventos;
