import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMeetingById , updateEstadoReunion} from "@services/reuniones.service.js";
import { getAsistenciasByReunion, updateAsistenciaEstado } from "@services/asistencia.service.js";
import ListaAsistencias from "@components/ListaAsistencias.jsx";
import '@styles/reuniondetalle.css';
import { uploadActaToMeeting } from "@services/reuniones.service.js";

const ReunionDetalle = () => {
    const { id } = useParams();
    const [reunion, setReunion] = useState(null);
    const [asistencias, setAsistencias] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);

    const reunionId = parseInt(id); 
    useEffect(() => {
    const fetchData = async () => {
        const reunionData = await getMeetingById(reunionId);
        const lista = await getAsistenciasByReunion(reunionId);
        setReunion(reunionData);
        setAsistencias(lista);
    };
    fetchData();
    }, [reunionId]);


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
  const [res, err] = await uploadActaToMeeting(reunion.id_reunion, selectedPdf);
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
        <h3> Detalles Renunión</h3>
        <h2>{reunion.nombre_reunion}</h2>
        <p><strong>📅 Fecha:</strong> {reunion.fecha_reunion}</p>
        <p><strong>🕒 Hora:</strong> {reunion.hora_inicio} - {reunion.hora_termino}</p>
        <p><strong>📍 Lugar:</strong> {reunion.lugar_reunion}</p>
        <p><strong>📌 Estado:</strong> {reunion.estado?.nombre_estado}
            <select
                value={reunion.estado?.id_estado}
                onChange={async (e) => {
                    const nuevoEstado = e.target.value;
                    const [, err] = await updateEstadoReunion(reunion.id_reunion, nuevoEstado);
                    if (!err) {
                        const updated = await getMeetingById(reunion.id_reunion);
                        setReunion(updated);
                    }
                }}
                >
                <option value="1">Pendiente</option>
                <option value="2">Suspendida</option>
                <option value="3">Realizada</option>
            </select>
        </p>
        <h3>📋 Lista de Asistencias</h3>
            <ListaAsistencias asistencias={asistencias} onUpdate={async (idAsistencia, nuevoEstado) => {
            const [, err] = await updateAsistenciaEstado(idAsistencia, nuevoEstado);
            if (!err) {
                const nuevas = await getAsistenciasByReunion(reunionId);
                nuevas.sort((a, b) => a.id_usuario.nombreCompleto.localeCompare(b.id_usuario.nombreCompleto));
                setAsistencias(nuevas);
        }
        }} />
        <div className="upload-section">
            <h3>📄 Subir Acta de Reunión (PDF)</h3>
            <input type="file" accept="application/pdf" onChange={handlePdfChange} />
            <button onClick={handleUploadPdf}>Subir Acta</button>
        </div>
        {reunion.acta_pdf && !selectedPdf && (
        <div className="pdf-viewer">
            <h4>📥 Acta actual:</h4>
            <embed
                src={`http://localhost:3000${reunion.acta_pdf}`}
                type="application/pdf"
                width="100%"
                height="400px"
            />
        </div>
        )}
        {pdfFile && (
        <div className="pdf-viewer">
        <embed src={pdfFile} type="application/pdf" width="100%" height="400px" />
        </div>
        )}
    </div>
    );
};

export default ReunionDetalle;
