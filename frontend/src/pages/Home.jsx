import { useEffect, useState } from "react";
import { getAllReuniones } from "../services/reuniones.service";
import Table from "../components/Table";
import '@styles/reuniondetalle.css';

const Home = () => {
  const [reuniones, setReuniones] = useState([]);
  const columns = [
    { title: 'Tema',field: 'descripcion_reunion',width: 330},
    { title: 'Fecha', field: 'fecha_reunion',width: 150},
    { title: 'Lugar', field: 'lugar_reunion',width: 150},
    { title: 'Acta',field: 'acta_pdf',formatter: (cell) => {  
      const acta = cell.getValue();
      if (acta) {
        return  `
          <div style="display: flex; justify-content: left; align-items: center; height: 100%;">
            <a
              href="http://localhost:3000${acta}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="color: white; background-color: #003366; padding: 4px 12px; border-radius: 6px; text-decoration: none;"
              >Descargar
            </a>
          </div>`;
        }
    return `
    <div style="display: flex; justify-content: left; align-items: center; height: 100%;">
    <span style="color: gray;">Sin acta</span>
    </div>`
    }, width: 150, hozAlign: "center"}
    ];
  useEffect(() => {
    const fetchReuniones = async () => {
      const data = await getAllReuniones();
      setReuniones(data);
    };

    fetchReuniones();
  }, []);

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Reuniones</h1>
        </div>  
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
