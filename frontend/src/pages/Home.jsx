import { useEffect, useState } from "react";
import { getAllReuniones } from "../services/reuniones.service";
import Table from "../components/Table";
import '@styles/reuniondetalle.css';

  var API_URL;
  if(window.location.origin !="http://localhost:5173" ){
      API_URL="http://146.83.198.35:1287"
  }else{
      API_URL="http://localhost:3000"
  }
const Home = () => {
  const [reuniones, setReuniones] = useState([]);
  const columns = [
    { title: 'Asunto',field: 'descripcion_reunion',width: 300},
    { title: 'Fecha', field: 'fecha_reunion',width: 180},
    { title: 'Acta',field: 'acta_pdf',formatter: (cell) => {  
      const acta = cell.getValue();
      if (acta) {
        return  `
          <div style="display: flex; justify-content:center; align-items: center; height: 100%;">
            <a
              href="${API_URL}${acta}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="color: white; background-color: #003366; padding: 4px 12px; border-radius: 6px; text-decoration: none;"
              >Descargar
            </a>
          </div>`;
        }
    return `
    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
    <span style="color: gray;">Sin acta</span>
    </div>`
    }, width: 200, hozAlign: "center"}
    ];
  useEffect(() => {
    const fetchReuniones = async () => {
      const data = await getAllReuniones();
      setReuniones(data);
    };

    fetchReuniones();
  }, []);

  return (
  <div className="reunion-detalle-contenedor">
    <div style={{
      maxWidth: "800px",
      width: "100%",
      padding: "2rem",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <h1 className="title-table">Reuniones</h1>
      <Table  
        data={reuniones}
        columns={columns}
        filter={false}
        dataToFilter={[]} 
        initialSortName="fecha_reunion"
        onSelectionChange={() => {}}
      />
    </div>
  </div>
);



};

export default Home;
