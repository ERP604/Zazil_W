import React from 'react'; // Importa React.
import "../styles/pagination.css"; // Importa los estilos para la paginación.

// Define la interfaz de las propiedades que recibe el componente Pagination.
interface PaginationProps {
  currentPage: number; // Página actual.
  totalPages: number; // Total de páginas.
  onPageChange: (page: number) => void; // Función para manejar el cambio de página.
}

// Componente Pagination que muestra los botones de navegación de páginas.
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Crea un array con los números de las páginas.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Renderiza los botones de paginación.
  return (
    <div className="pagination"> {/* Contenedor principal de la paginación. */}
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Anterior {/* Botón para ir a la página anterior. */}
      </button>
      {pages.map((page) => ( // Mapea las páginas para crear un botón por cada una.
        <button key={page} className={page === currentPage ? 'active' : ''} onClick={() => onPageChange(page)}>
          {page} {/* Muestra el número de la página. */}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Siguiente {/* Botón para ir a la siguiente página. */}
      </button>
    </div>
  );
};

export default Pagination; // Exporta el componente Pagination para su uso en otras partes de la aplicación.
