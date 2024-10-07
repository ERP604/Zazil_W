import React from 'react'; // Importa React.
import "../styles/searchBar.css"; // Importa los estilos para la barra de búsqueda.

// Define la interfaz de las propiedades que recibe el componente SearchBar.
interface SearchBarProps {
  placeholder: string; // Texto del placeholder del campo de búsqueda.
  filters?: React.ReactNode; // Opcional: componentes de filtro que se mostrarán debajo del campo de búsqueda.
}

// Componente SearchBar que permite buscar elementos.
const SearchBar: React.FC<SearchBarProps> = ({ placeholder, filters }) => {
  // Renderiza la barra de búsqueda y los filtros si se proporcionan.
  return (
    <div className="search-bar"> {/* Contenedor principal de la barra de búsqueda. */}
      <input type="text" placeholder={placeholder} className="search-input" /> {/* Campo de entrada de texto. */}
      {filters && <div className="filters">{filters}</div>} {/* Muestra los filtros si existen. */}
    </div>
  );
};

export default SearchBar; // Exporta el componente SearchBar para su uso en otras partes de la aplicación.
