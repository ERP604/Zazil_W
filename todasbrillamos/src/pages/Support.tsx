import React from 'react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import "../styles/support.css";

const Soporte: React.FC = () => {
  return (
    <div className="soporte-page">
      <h1>Soporte</h1>
      <SearchBar placeholder="Buscar..." />
      <div className="filters">
        <label>Filtrar por:</label>
        <select>
          <option>Estatus</option>
          <option>Recientes</option>
          <option>Antiguos</option>
        </select>
      </div>
      <table className="support-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Juan Roberto</td>
            <td>Pérez López</td>
            <td className="respondido">Respondida</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Juan Roberto</td>
            <td>Pérez López</td>
            <td className="sin-responder">Sin responder</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Juan Roberto</td>
            <td>Pérez López</td>
            <td className="respondido">Respondida</td>
          </tr>
        </tbody>
      </table>

      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={(page) => {
          console.log(`Cambiando a la página ${page}`);
          // Lógica para manejar el cambio de página
        }} 
      />
      
      <div className="add-admin-container">
        <button className="add-admin-button">
          <span>+</span>
          <p>Agregar Administrador</p>
        </button>
      </div>
    </div>
  );
};

export default Soporte;
