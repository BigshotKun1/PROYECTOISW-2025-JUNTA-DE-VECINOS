import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getEstadisticasAsistencia } from "@services/asistencia.service.js"; // <-- debes implementar este servicio

const COLORS = ["#006699", "#999999"];

const EstadisticasReuniones = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getEstadisticasAsistencia();
      const now = new Date();

      const datosLimpios = res
        .map(r => ({
          ...r,
          presentes: Number(r.presentes),
          ausentes: Number(r.ausentes),
          fecha: new Date(r.reunion_fecha_reunion)
        }))
        .filter(r => 
          r.fecha.getMonth() === now.getMonth() &&
          r.fecha.getFullYear() === now.getFullYear()
        );
      setDatos(datosLimpios);
  };
  fetch();
  }, []);

  const totalPresentes = datos.reduce((acc, r) => acc + r.presentes, 0);
  const totalAusentes = datos.reduce((acc, r) => acc + r.ausentes, 0);
  const totalPie = [
    { name: "Presentes", value: totalPresentes },
    { name: "Ausentes", value: totalAusentes },
  ];  
  return (
  <div style={{ margin: "30px", display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "center"}}>
    <div style={{ flex: "1 1 500px", maxWidth: "600px", height: "300px" }}>
      <h3 style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: '5px' }}>📊</span> Asistencia por reunión
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos}>
          <XAxis dataKey="reunion" tickFormatter={() => ""}/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="presentes" fill="#003366" name="Presentes" />
          <Bar dataKey="ausentes" fill="#5a9bd5" name="Ausentes" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div style={{ flex: "1 1 300px", maxWidth: "400px", height: "300px" }}>
      <h3 style={{ marginBottom: "10px" }}>🧮 Asistencia total Mensual</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={totalPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label>
            {totalPie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);
};

export default EstadisticasReuniones;
