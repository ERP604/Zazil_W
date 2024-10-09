import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import "../styles/accountsPage.css";

interface Account {
  id_usuario: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  estatus: string;
  tipo_usuario: string;
}

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const LIMIT = 20; // Límite de 20 usuarios por página

  // Calcular el número total de páginas basado en el límite y la cantidad de cuentas
  const totalPages = Math.ceil(accounts.length / LIMIT);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/usuario');
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (accountToDelete) {
      try {
        const response = await fetch(`/api/usuario/${accountToDelete.id_usuario}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setAccounts(accounts.filter(acc => acc.id_usuario !== accountToDelete.id_usuario));
          setShowModal(false);
          setAccountToDelete(null);
          
          // Ajustar la página si eliminamos la última cuenta en la página actual
          if ((currentPage - 1) * LIMIT >= accounts.length - 1) {
            setCurrentPage(prev => Math.max(prev - 1, 1));
          }
        } else {
          const errorMsg = await response.text();
          console.error("Error al eliminar el usuario:", errorMsg);
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setAccountToDelete(null);
  };

  // Calcular los índices de los usuarios a mostrar en la página actual
  const startIndex = (currentPage - 1) * LIMIT;
  const currentAccounts = accounts.slice(startIndex, startIndex + LIMIT);

  return (
    <div className="accounts-page">
      <h1>Cuentas</h1>
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
          {currentAccounts.map((account) => (
            <tr key={account.id_usuario}>
              <td>{account.id_usuario}</td>
              <td>{account.nombre}</td>
              <td>{account.apellido_paterno} {account.apellido_materno}</td>
              <td className={account.estatus === 'activo' ? 'account-active' : 'account-suspended'}>
                {account.estatus}
              </td>
              <td>{account.tipo_usuario}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteClick(account)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {currentAccounts.length === 0 && (
            <tr>
              <td colSpan={6}>No hay cuentas para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <div className="add-admin-container">
        <Link to="/anadiradministrador">
          <button className="add-admin-button">
            <p>Agregar Administrador</p>
          </button>
        </Link>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar esta cuenta?</h2>
            <p>Cuenta: {accountToDelete?.nombre} {accountToDelete?.apellido_paterno}</p>
            <button onClick={confirmDelete}>Confirmar</button>
            <button onClick={cancelDelete}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
