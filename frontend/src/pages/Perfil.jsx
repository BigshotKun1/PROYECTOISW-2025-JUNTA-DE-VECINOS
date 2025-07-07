import { useState, useEffect } from "react";
import '@styles/perfil.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('usuario'));
    setUser(userData);
  }, []);

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const pdfURL = URL.createObjectURL(file);
      setPdfFile(pdfURL);
    } else {
      alert("Solo se permiten archivos PDF.");
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          className="profile-image"
          src="/img/gojo.jpg"
          alt="Foto de perfil"
        />
        <div className="profile-details">
          <h2>{user.nombreCompleto}</h2>
          <p><strong>RUT:</strong> {user.rut}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {typeof user.rol === 'object' ? user.rol.nombreRol : user.rol}</p>

          <div className="upload-section">
            <label htmlFor="pdfUpload"><strong>Subir documento PDF:</strong></label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              id="pdfUpload"
            />
          </div>

          {pdfFile && (
          <div className="pdf-viewer">

              <embed src={pdfFile} type="application/pdf" width="100%" height="400px" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
