import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTachometerAlt, faBox, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import "../styles/sidebar.css";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
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
      </ul>
      <div className="sidebar__footer">
        <ul>
          <li>
            <Link to="/ajustes">
              <FontAwesomeIcon icon={faCog} className="sidebar__icon" /> Ajustes
            </Link>
          </li>
          <li>
            {/* Añadir onClick para el logout */}
            <span onClick={onLogout} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faSignOutAlt} className="sidebar__icon" /> Cerrar Sesión
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
