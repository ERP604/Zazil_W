import React, { ReactNode } from "react"; // Importa React y ReactNode para definir los tipos de los hijos.
import Sidebar from "../components/Sidebar"; // Importa el componente Sidebar.
import "../styles/mainLayout.css"; // Importa los estilos para el layout principal.

// Define la interfaz de las propiedades que recibe el componente MainLayout.
interface MainLayoutProps {
  children: ReactNode; // Contenido que se mostrará en el layout principal.
  onLogout: () => void; // Función que se ejecuta al cerrar sesión.
}

// Componente MainLayout que organiza la estructura de la aplicación con un Sidebar y un contenido principal.
const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className="main-layout"> {/* Contenedor principal del layout. */}
      {/* Se pasa la función onLogout al componente Sidebar */}
      <Sidebar onLogout={onLogout} /> {/* Renderiza el componente Sidebar con la función de cierre de sesión. */}
      <div className="main-content"> {/* Contenedor para el contenido principal. */}
        {children} {/* Renderiza el contenido hijo pasado al layout. */}
      </div>
    </div>
  );
};

export default MainLayout; // Exporta el componente MainLayout para su uso en otras partes de la aplicación.
