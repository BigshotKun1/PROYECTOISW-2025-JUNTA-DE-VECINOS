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
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";
import { uploadCertificado } from '../services/user.service';

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

  const handleSelectionChange = useCallback((selectedUsers) => {
    setDataUser(selectedUsers);
  }, [setDataUser]);

  const columns = [
    { title: "Nombre", field: "nombreCompleto", width: 250, responsive: 0 },
    { title: "Correo electrónico", field: "email", width: 250, responsive: 3 },
    { title: "Rut", field: "rut", width: 100, responsive: 2 },
    { title: "Rol", field: "rol", width: 150, responsive: 2 },
    { title: "Creado", field: "createdAt", width: 200, responsive: 2 },
    { title: "Cert. Residencia", field: "certificadoResidencia_pdf",
    formatter: (cell) => {
      const certificado = cell.getValue();
      if (certificado) {
        return `<a
                  href="http://localhost:3000${certificado}"
                  target="_blank"
                  style="color:white;background:#003366;padding:4px 12px;border-radius:6px;"
                >Descargar</a>`;
      }
      const { rut } = cell.getRow().getData();
      return `<button
                class="tabulator-upload-btn"
                data-rut="${rut}"
                style="padding:4px 8px;border-radius:4px; border:none;cursor:pointer;"
              >Subir</button>`;
    },
    cellClick: (e, ) => {
      if (e.target.classList.contains("tabulator-upload-btn")) {
        //const rut = e.target?.dataset.rut;
        const rut = e.target.dataset.rut;
        openFileDialog(rut);
      }
    },
    width: 180,
    hozAlign: "center",
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