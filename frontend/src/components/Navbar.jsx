import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";
import { FaHome, FaUsers, FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaUser, FaVoteYea} from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
  const userRole = user?.rol;
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutSubmit = () => {
    try {
      logout();
      navigate('/auth'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* IZQUIERDA */}
        <div className="navbar-left">
            <NavLink to="/perfil" className="nav-link">
            <FaUser style={{  fontSize: '30px', marginRight: '8px' }} />
          </NavLink>
        </div>

        {/* DERECHA */}
        <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
          <ul className="navbar-right">
            {userRole === 'Administrador' || userRole === 'Tesorero' &&  (
              <>
                <li>
                    <NavLink to="/home" className="nav-link">
            <FaHome style={{  fontSize: '24px', marginRight: '8px' }} />
          </NavLink>
                  <NavLink to="/users">
                    <FaUsers style={{ marginRight: '5px' }} />
                    Usuarios
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/eventos">
                    <FaCalendarAlt style={{ marginRight: '5px' }} />
                    Eventos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/reuniones">
                    <FaClipboardList style={{ marginRight: '5px' }} />
                    Reuniones
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/votaciones">
                    <FaVoteYea style={{ marginRight: '5px' }} />
                    Votaciones
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink to="/auth" onClick={logoutSubmit}>
                <FaSignOutAlt style={{ marginRight: '5px' }} />
                Cerrar sesión
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
