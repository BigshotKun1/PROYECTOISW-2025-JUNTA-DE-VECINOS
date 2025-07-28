import Table from '@components/Table';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Search from '../components/Search';
import Popup from '../components/Popup';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useRef, useCallback, useState } from 'react';
import '@styles/users.css';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import { showSuccessAlert, deleteDataAlert, showErrorAlert } from "@helpers/sweetAlert.js";
import { uploadCertificado, deleteCertificado } from '../services/user.service';
import { Link } from "react-router-dom";



  var API_URL;
  if(window.location.origin !="http://localhost:5173" ){
      API_URL="http://146.83.198.35:1287"
  }else{
      API_URL="http://localhost:3000"
  }
const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');
  //const [, setPdfFile] = useState(null);
  //const [selectedPdf, setSelectedPdf] = useState(null);
  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

  const handleRutFilterChange = (e) => {
    setFilterRut(e.target.value);
  };

   const user = JSON.parse(sessionStorage.getItem("usuario"))
    const isAdmin = user?.rol === "Administrador";

  const handleSelectionChange = useCallback((selectedUsers) => {
    setDataUser(selectedUsers);
  }, [setDataUser]);
  console.log(users)
  const columns = [
    { title: "Nombre", field: "nombreCompleto", width: 300, responsive: 0 },
    { title: "Correo electrónico", field: "email", width: 250, responsive: 3 },
    { title: "Rut", field: "rut", width: 100, responsive: 2 },
    { title: "Rol", field: "rol", width: 160, responsive: 2 },
    { title: "Creado", field: "createdAt", width: 200, responsive: 2 },
    { title: "Cert. Residencia", field: "certificadoResidencia_pdf",
    formatter: (cell) => {
      const certificado = cell.getValue();
      const { rut } = cell.getRow().getData();

      if (certificado) {
        return `
          <div style="display: flex; gap: 8px; justify-content: center;">
            <a
              href="${API_URL}${certificado}"
              target="_blank"
              style="color: white; background-color: #003366; padding: 6px 16px; border-radius: 6px; text-decoration: none;"
            >Descargar</a>
            <button
              class="tabulator-delete-cert-btn"
              data-rut="${rut}"
              style="color: white; background-color: #cc0000; padding: 6px 16px; border-radius: 6px; border: none; cursor: pointer;"
            >Eliminar</button>
          </div>`;
      }
      return `
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="tabulator-upload-btn" data-rut="${rut}" style="color:white; background-color: #3887eeff; padding: 6px 16px; border-radius: 6px; border: none; cursor: pointer;">
            Subir
          </button>
        </div>`;
    },
    cellClick: async (e,) => {
      const rut = e.target.dataset.rut;

      if (e.target.classList.contains("tabulator-delete-cert-btn")) {
        try {
          const result = await deleteDataAlert();
          console.log(result)
          if (result.isConfirmed) {
            //console.log("rut a enviar",rut)
            const [, err] = await deleteCertificado(rut);
            await fetchUsers(); 
            if (err) {
              showErrorAlert("Error al eliminar", "No se pudo eliminar el Certificado. Inténtalo nuevamente.");
            } else {
              showSuccessAlert("¡Eliminado!", "El certificado se eliminó correctamente");
            }
          }
          await fetchUsers();
        } catch (error) {
          console.error("Error inesperado:", error);
          showErrorAlert("Error", "Ocurrió un error inesperado al eliminar el certificado");
      }
    return;
  }
  if (e.target.classList.contains("tabulator-upload-btn")) {
    openFileDialog(rut);
      }
    },
    width: 250,
    hozAlign: "center",
  },
  { title: "Fecha Cert. Residencia", field: "fechaCertificadoResidencia", width: 200, responsive: 0,
      formatter: (cell) => {
      const rawDate = cell.getValue();
      if (!rawDate) return "";
        const fecha = new Date(rawDate);
        return fecha.toLocaleDateString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    },
  ];

  const fileInputRef = useRef();

  const openFileDialog = (rut) => {
    fileInputRef.current.dataset.rut = rut;
    fileInputRef.current.click();
  };

  const onFileSelected = async (e) => {
  const file = e.target.files[0];
  const rut = e.target.dataset.rut;
  //console.log("RUT para el backenf",rut)
  if (!file || file.type !== "application/pdf") {
    return showErrorAlert("Archivo no válido", "Solo PDFs");
  }
  const [, err] = await uploadCertificado(rut, file);
  if (err) {
    return showErrorAlert("Error al subir", err.response?.data?.message || err.message);
  }
  showSuccessAlert("¡Subido!", "Certificado cargado");
  await fetchUsers();      
  e.target.value = null;   
};


  return (
    <div className='main-container'>
      <input type="file" accept="application/pdf" ref={fileInputRef} style={{ display: "none" }} onChange={onFileSelected}/>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Usuarios</h1>
            {isAdmin &&(
            <Link to={`/directiva`}>
              <h1 className='title-table'>Directivas</h1>
            </Link>
            )}
          <div className='filter-actions'>
            <Search value={filterRut} onChange={handleRutFilterChange} placeholder={'Filtrar por rut'} />
            <button onClick={handleClickUpdate} disabled={dataUser.length === 0}>
              {dataUser.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button className='delete-user-button' disabled={dataUser.length === 0} onClick={() => handleDelete(dataUser)}>
              {dataUser.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={users}
          columns={columns}
          filter={filterRut}
          dataToFilter={'rut'}
          initialSortName={'nombreCompleto'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
    </div>
  );
};

export default Users;