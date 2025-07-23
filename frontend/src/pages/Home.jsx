import { useEffect, useState } from "react";
import { getAllReuniones } from "../services/reuniones.service";
import Table from "../components/Table"; 
const columns = [
  {
    title: 'Tema',
    field: 'descripcion_reunion',
  },
  {
    title: 'Fecha',
    field: 'fecha_reunion',
  },
  {
    title: 'Acta',
    field: 'acta_pdf',
    formatter: (cell) => {
      const acta = cell.getValue();
      if (acta) {
        return `<a href="http://localhost:3000${acta}" target="_blank" rel="noopener noreferrer" style="color: white; background-color: #003366; padding: 4px 12px; border-radius: 6px; text-decoration: none;">Descargar</a>`;
      } else {
        return '<span style="color: gray;">Sin acta</span>';
      }
    },
    hozAlign: "center"
  }
];

const Home = () => {
  const [reuniones, setReuniones] = useState([]);

  useEffect(() => {
    const fetchReuniones = async () => {
      const data = await getAllReuniones();
      setReuniones(data);
    };

    fetchReuniones();
  }, []);

  return (
    <main className="home">
      <div className="card">
        <h1>Actas de Reuniones</h1>
        <main className="home">
          <div className="card">
            <h1 className="text-xl font-bold mb-4">Actas de Reuniones</h1>
              <Table  
                data={reuniones}
                columns={columns}
                filter={false}
                dataToFilter={[]} 
                initialSortName="fecha_reunion"
                onSelectionChange={() => {}}
                />
          </div>
        </main>
      </div>
    </main>
  );
};

export default Home;
