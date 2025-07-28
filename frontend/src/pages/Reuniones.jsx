import { useEffect, useState } from "react";
import { getAllReuniones } from "@services/reuniones.service.js";
import CalendarioReuniones from "@components/CalendarioReuniones.jsx";


const Reuniones = () => {
    const [reuniones, setReuniones] = useState([]);

    const fetchReuniones = async () => {
    const data = await getAllReuniones();
    const formateadas = data.map(r => {
    const horaInicio = r.hora_inicio?.slice(0, 5);
    return {
        ...r,
        title: `${horaInicio} ${r.descripcion_reunion}`,
        start: r.fecha_reunion,        
        backgroundColor: "#3887eeff",
        borderColor: "#f8fbff", 
        textColor: "#ffffffff",
        id: r.id_reunion, 
    };
    });
    setReuniones(formateadas);
    };


    useEffect(() => {
        fetchReuniones();
    }, []);

    const hoy = new Date();
    //console.log(hoy)
    const reunionesHoy = reuniones.filter(r => r.fecha_reunion === hoy);

    const reunionesProximas = reuniones.filter(r => {

        const fecha = new Date(r.fecha_reunion);
        const fechaUTC = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        const hoyUTC = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(),hoy.getHours(),hoy.getMinutes());

        //console.log("fechaUTC: ",fechaUTC)
        //console.log("hoyUTC: ",hoyUTC)
        const diferenciaDias = (fechaUTC - hoyUTC) / (1000 * 60 * 60 * 24);
        //console.log("diferenciaDias: ",diferenciaDias)
        return diferenciaDias > -0.3 && diferenciaDias <= 14;
    });

    return (
        
    <div className="contenedor-principal">
        
        <div className="panel-lateral">
        <h2>{hoy.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        
        <h3>📌 Reuniones de Hoy</h3>
        {reunionesHoy.length > 0 ? (
            reunionesHoy.map(r => {
            const inicio = new Date(`1970-01-01T${r.hora_inicio}`);
            const termino = new Date(`1970-01-01T${r.hora_termino}`);
            const formatoHora = (f) => f.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
            return (
                <div key={r.id_reunion}>
                <p>📢 {r.descripcion_reunion}, 🕒 {formatoHora(inicio)} - {formatoHora(termino)}</p>
                <div  style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                </div>
                </div>
                
            );
            })
            
        ) : (
            <p>Sin reuniones hoy</p>
        )}

        <h3 style={{ marginTop: '20px' }}>🗓️ Próximas reuniones</h3>
        {reunionesProximas.length > 0 ? (
            reunionesProximas.map(r => (
            <p key={r.id_reunion}>
                🧩 {r.descripcion_reunion} ➡️ {r.fecha_reunion}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>     
            </div>
            </p>
            
            ))
        ) : (
            <p>No hay reuniones en los próximos días</p>
        )}
        </div>
        <div className="panel-calendario">
        <CalendarioReuniones reuniones={reuniones} fetchReuniones={fetchReuniones} />
        </div>
        
    </div>
    
    );
};

export default Reuniones;
