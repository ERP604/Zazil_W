import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTachometerAlt, faBox, faScrewdriverWrench, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
<<<<<<< HEAD
import "./../styles/sidebar.css";
=======
import "../styles/sidebar.css";
>>>>>>> 69a2f83ecf749daf72b0471f48d43f4e5df3daf2

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2>Zazil</h2>
      </div>
      <ul className="sidebar__nav">
        <li>
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faTachometerAlt} className="sidebar__icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/productos">
            <FontAwesomeIcon icon={faBox} className="sidebar__icon" /> Productos
          </Link>
        </li>
        <li>
          <Link to="/cuentas">
            <FontAwesomeIcon icon={faUser} className="sidebar__icon" /> Cuentas
          </Link>
        </li>
        <li>
          <Link to="/soporte">
          <FontAwesomeIcon icon={faScrewdriverWrench} className="sidebar__icon" /> Soporte
          </Link>
        </li>
      </ul>
      <div className="sidebar__footer">
        <ul>
          <li>
            <Link to="/ajustes">
              <FontAwesomeIcon icon={faCog} className="sidebar__icon" /> Ajustes
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <FontAwesomeIcon icon={faSignOutAlt} className="sidebar__icon" /> Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
