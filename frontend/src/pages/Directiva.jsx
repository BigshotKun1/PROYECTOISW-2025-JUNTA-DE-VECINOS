
import useDirectiva from '@hooks/directiva/useGetDirectiva';
import TablaDirectiva from '@components/directiva/TablaDirectiva.jsx';
import ModalCrearDirectiva from '@components/directiva/ModalCrearMiembroDirectiva.jsx';
import Table from '@components/Table';
import Search from '../components/Search';
import Popup from '../components/Popup';  // Reemplaza o crea uno para modal Crear/Editar miembro
import { Plus } from "lucide-react";
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisabled from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import { useEditDirectiva } from '@hooks/directiva/useEditDirectiva';
import { useDeleteDirectiva } from '@hooks/directiva/useDeleteDirectiva';
import { createDirectiva } from '@services/directiva.service.js';
import "@styles/directiva.css";
import { Link } from "react-router-dom";



const DirectivaPage = () => {
  const { directiva = [], fetchDirectiva, setDirectiva } = useDirectiva();
  const [filterNombre, setFilterNombre] = useState('');
  const [dataSelected, setDataSelected] = useState([]);
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);

  const {
    handleClickEdit,
  } = useEditDirectiva(setDirectiva);

  const { handleDelete } = useDeleteDirectiva(fetchDirectiva, setDataSelected);

  const noItemsSelected = !dataSelected || dataSelected.length === 0;

  const handleNombreFilterChange = (e) => {
    setFilterNombre(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedItems) => {
    setDataSelected(selectedItems);
  }, []);

 const handleAddClick = () => {
  setIsModalCrearOpen(true); 
};

   const isPeriodoActivo = (periodo) => {
    if (!periodo || !periodo.fechaInicio || !periodo.fechaTermino) return false;
    const hoy = new Date();
    const inicio = new Date(periodo.fechaInicio);
    const termino = new Date(periodo.fechaTermino);
    return hoy >= inicio && hoy <= termino;
  };

  const handleCrearDirectiva = async (nuevaDirectiva) => {
  try {
    await createDirectiva(nuevaDirectiva);
    await fetchDirectiva(); // recarga la tabla después de crear
    setIsModalCrearOpen(false); // cierra el modal
  } catch (error) {
    console.error("Error al crear directiva:", error);
  }
};



  const columns = [
    { title: "RUT", field: "usuario.rut", width: 150, responsive: 0 },
    { title: "Nombre Completo", field: "usuario.nombreCompleto", width: 300, responsive: 0 },
    { title: "Rol", field: "rol.nombreRol", width: 200, responsive: 2 },
    { title: "Inicio Periodo", field: "periodo.fechaInicio", width: 200, responsive: 2 },
    { title: "Fin Periodo", field: "periodo.fechaTermino", width: 200, responsive: 2 },
    {
      title: "¿Periodo Activo?",
      field: "periodo",
      formatter: (cell) => {
        const periodo = cell.getValue();
        return isPeriodoActivo(periodo) ? "Activo" : "Inactivo";
      },
      width: 200,
      responsive: 2
    },
  ];
  

  return (
    <div className='main-container'>
      <div className='table-container-directiva'>
        <div style={{ width:"90%", maxWidth:"970px", margin: "0 auto"}}>
        <div className='top-table'>
            <Link to={`/users`}>
              <h1 className='title-table'>Usuarios</h1>
            </Link>
          <h1 className='title-table'>Directiva</h1>
          
          <div className='filter-actions'>
            <Search value={filterNombre} onChange={handleNombreFilterChange} placeholder={'Filtrar por nombre'} />
            <button onClick={handleAddClick} title="Agregar miembro a la directiva">
              <Plus size={20} />
            </button>
            <button onClick={handleClickEdit} disabled={noItemsSelected} title="Editar miembro">
              {noItemsSelected ? (
                <img src={UpdateIconDisable} alt="Editar deshabilitado" />
              ) : (
                <img src={UpdateIcon} alt="Editar" />
              )}
            </button>
            <button onClick={() => handleDelete(dataSelected)} disabled={noItemsSelected} title="Eliminar miembro">
              {noItemsSelected ? (
                <img src={DeleteIconDisabled} alt="Eliminar deshabilitado" />
              ) : (
                <img src={DeleteIcon} alt="Eliminar" />
              )}
            </button>
          </div>
          </div>
        </div>

        <Table
          data={directiva}
          columns={columns}
          filter={filterNombre}
          dataToFilter={'usuario.nombreCompleto'}
          initialSortName={'usuario.nombreCompleto'}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {isModalCrearOpen && (
  <ModalCrearDirectiva
    isOpen={isModalCrearOpen}
    onClose={() => setIsModalCrearOpen(false)}
    onCreate={handleCrearDirectiva} // ya la definiste antes
  />
)}
    </div>
  );
};

export default DirectivaPage;
