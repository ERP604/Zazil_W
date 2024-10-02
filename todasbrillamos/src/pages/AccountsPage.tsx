import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import "../styles/accountsPage.css";

interface Account {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  role: string;
}

const AccountsPage: React.FC = () => {
  // Datos de ejemplo, esto se reemplazará por datos de la base de datos
  //const [accounts, setAccounts] = useState<Account[]>([
  const [accounts] = useState<Account[]>([
    { id: 1, firstName: 'Juan Roberto', lastName: 'Pérez López', status: 'Activo', role: 'Administrador' },
    { id: 2, firstName: 'Juan Roberto', lastName: 'Pérez López', status: 'Suspendido', role: 'Usuario' },
    { id: 3, firstName: 'Juan Roberto', lastName: 'Pérez López', status: 'Activo', role: 'Administrador' },
  ]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Número de páginas
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Lógica para cargar cuentas.
  };

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
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.firstName}</td>
              <td>{account.lastName}</td>
              <td className={account.status === 'Activo' ? 'account-active' : 'account-suspended'}>
                {account.status}
              </td>
              <td>{account.role}</td>
              <td>
                <button className="delete-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <div className="add-admin-container">
      <Link to="/añadiradministrador">
        <button className="add-admin-button">
          <span>+</span>
          <p>Agregar Administrador</p>
        </button>
      </Link>
      </div>
    </div>
  );
};

export default AccountsPage;
