import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; // Para la navegación
import SearchBar from '../components/SearchBar'; // Barra de búsqueda
import Pagination from '../components/Pagination'; // Componente de paginación
import "../styles/accountsPage.css"; // Importar estilos

// Definir la estructura de una cuenta
interface Account {
  id_usuario: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  estatus: string;
  tipo_usuario: string;
}

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]); // Estado para almacenar cuentas
  const [currentPage, setCurrentPage] = useState(1); // Estado de la página actual
  const [showModal, setShowModal] = useState(false); // Estado del modal de confirmación
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null); // Cuenta a eliminar
  const totalPages = 5; // Total de páginas para paginación

  // Hook para obtener las cuentas de la API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/usuarios'); // Solicitud para obtener cuentas
        const data = await response.json(); // Parsear la respuesta en JSON
        setAccounts(data); // Almacenar cuentas en el estado
      } catch (error) {
        console.error("Error fetching accounts:", error); // Mostrar error en caso de fallo
      }
    };

    fetchAccounts(); // Ejecutar la función para obtener las cuentas
  }, []); // Se ejecuta solo al montar el componente

  // Manejador del cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Actualizar la página actual
    // Aquí podría ir la lógica para cargar cuentas según la página.
  };

  // Manejador para mostrar el modal de confirmación de eliminación
  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account); // Establecer la cuenta que se quiere eliminar
    setShowModal(true); // Mostrar el modal
  };

  // Función que confirma la eliminación de una cuenta
  const confirmDelete = () => {
    if (accountToDelete) {
      // Eliminar la cuenta del estado
      setAccounts(accounts.filter(acc => acc.id_usuario !== accountToDelete.id_usuario));
      setShowModal(false); // Ocultar el modal
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowModal(false); // Ocultar el modal
    setAccountToDelete(null); // Limpiar la cuenta seleccionada
  };

  return (
    <div className="accounts-page">
      <h1>Cuentas</h1>

      {/* Barra de búsqueda con filtros */}
      <SearchBar 
        placeholder="Buscar..." 
        filters={
          <div>
            <label>Filtrar por:</label>
            <select>
              <option value="">Estatus</option>
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
            </select>
            <select>
              <option value="">Recientes</option>
              <option value="antiguos">Antiguos</option>
            </select>
          </div>
        } 
      />

      {/* Tabla de cuentas */}
      <table className="accounts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Estatus</th>
            <th>Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id_usuario}>
              <td>{account.id_usuario}</td>
              <td>{account.nombre}</td>
              <td>{account.apellido_paterno} {account.apellido_materno}</td>
              {/* Clase condicional para resaltar el estatus */}
              <td className={account.estatus === 'activo' ? 'account-active' : 'account-suspended'}>
                {account.estatus}
              </td>
              <td>{account.tipo_usuario}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteClick(account)}>Eliminar</button> {/* Botón para eliminar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Botón para agregar administrador */}
      <div className="add-admin-container">
        <Link to="/añadiradministrador">
          <button className="add-admin-button">
            <p>Agregar Administrador</p>
          </button>
        </Link>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar esta cuenta?</h2>
            <p>Cuenta: {accountToDelete?.nombre} {accountToDelete?.apellido_paterno}</p>
            <button onClick={confirmDelete}>Confirmar</button> {/* Botón para confirmar eliminación */}
            <button onClick={cancelDelete}>Cancelar</button> {/* Botón para cancelar */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
