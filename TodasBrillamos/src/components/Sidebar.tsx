import React from "react"; // Importa React.
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa el componente de iconos de FontAwesome.
import { faUser, faTachometerAlt, faBox, faSignOutAlt, faComments, faBullhorn} from '@fortawesome/free-solid-svg-icons'; // Importa los iconos que se usarán.
import "../styles/sidebar.css"; // Importa los estilos para la barra lateral (sidebar).

// Define la interfaz de las propiedades que recibe el componente Sidebar.
interface SidebarProps {
  onLogout: () => void; // Función para manejar el cierre de sesión.
}

// Componente Sidebar que proporciona enlaces de navegación y opciones para el usuario.
const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  // Renderiza la barra lateral con enlaces y la opción de cerrar sesión.
  return (
    <div className="sidebar"> {/* Contenedor principal de la barra lateral. */}
      <div className="sidebar__header">
        <h2>Zazil</h2> {/* Título de la barra lateral. */}
      </div>
      <ul className="sidebar__nav"> {/* Lista de navegación. */}
        <li>
          <Link to="/dashboard"> {/* Enlace al dashboard. */}
            <FontAwesomeIcon icon={faTachometerAlt} className="sidebar__icon" /> Dashboard {/* Icono y texto. */}
          </Link>
        </li>
        <li>
          <Link to="/productos"> {/* Enlace a productos. */}
            <FontAwesomeIcon icon={faBox} className="sidebar__icon" /> Productos {/* Icono y texto. */}
          </Link>
        </li>
        <li>
          <Link to="/cuentas"> {/* Enlace a cuentas. */}
            <FontAwesomeIcon icon={faUser} className="sidebar__icon" /> Cuentas {/* Icono y texto. */}
          </Link>
        </li>
        <li>
          <Link to="/foro"> {/* Enlace a foro. */}
            <FontAwesomeIcon icon={faComments} className="sidebar__icon" /> Foro {/* Icono y texto. */}
          </Link>
        </li>
        <li>
          <Link to="/anuncios"> {/* Enlace a anuncios. */}
            <FontAwesomeIcon icon={faBullhorn} className="sidebar__icon" /> Anuncios {/* Icono y texto. */}
          </Link>
        </li>
      </ul>
      <div className="sidebar__footer"> {/* Contenedor del pie de la barra lateral. */}
        <ul>
          <li>
            {/* Añadir onClick para el logout */}
            <span onClick={onLogout} style={{ cursor: 'pointer' }}> {/* Maneja el clic para cerrar sesión. */}
              <FontAwesomeIcon icon={faSignOutAlt} className="sidebar__icon" /> Cerrar Sesión {/* Icono y texto. */}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; // Exporta el componente Sidebar para su uso en otras partes de la aplicación.
