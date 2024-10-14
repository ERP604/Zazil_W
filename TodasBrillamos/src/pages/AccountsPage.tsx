import React, { useState, useEffect, ChangeEvent } from 'react';
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
  email: string;
  ruta_img: string;
}

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  //Añadidos para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para la búsqueda
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Estado para el filtro de estatus
  const [selectedAccountType, setSelectedAccountType] = useState<string>(''); // Estado para el filtro de tipo de cuenta

  //Opciones para los filtros
  const statusOptions: string[] = ['activo', 'suspendido']; 
  const accountTypeOptions = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'usuario_n', label: 'Usuario' },
  ];

  //Handlers para la búsqueda y filtros
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleAccountTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountType(e.target.value);
    setCurrentPage(1);
  };

  const LIMIT = 20; // Límite de 20 usuarios por página

  // Calcular el número total de páginas basado en el límite y la cantidad de cuentas filtradas
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = `${account.nombre} ${account.apellido_paterno} ${account.apellido_materno}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus ? account.estatus === selectedStatus : true;
    const matchesAccountType = selectedAccountType ? account.tipo_usuario === selectedAccountType : true;
    return matchesSearch && matchesStatus && matchesAccountType;
  });

  const totalPages = Math.ceil(filteredAccounts.length / LIMIT);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación

        const response = await fetch('/api/usuario', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Añadir el token aquí
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Account[] = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError("No se pudieron cargar las cuentas.");
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
      setLoadingIds(prev => [...prev, accountToDelete.id_usuario]); // Añadir ID a la lista de cargando
      try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación

        const response = await fetch(`/api/usuario/${accountToDelete.id_usuario}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`, // Añadir el token aquí
          },
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
          setError("No se pudo eliminar el usuario.");
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
        setError("Error al eliminar el usuario.");
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== accountToDelete.id_usuario)); // Remover ID de la lista
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setAccountToDelete(null);
  };

  // Función para cambiar el estado del usuario
  const toggleAccountStatus = async (account: Account) => {
    const nuevoEstado = account.estatus === 'activo' ? 'suspendido' : 'activo';
    setLoadingIds(prev => [...prev, account.id_usuario]);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación

      const response = await fetch(`/api/usuario/${account.id_usuario}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añadir el token aquí
        },
        body: JSON.stringify({ estatus: nuevoEstado }),
      });

      if (response.ok) {
        setAccounts(prevAccounts =>
          prevAccounts.map(acc =>
            acc.id_usuario === account.id_usuario
              ? { ...acc, estatus: nuevoEstado }
              : acc
          )
        );
      } else {
        const errorMsg = await response.text();
        console.error("Error al cambiar el estado del usuario:", errorMsg);
        setError("No se pudo cambiar el estado del usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud de cambio de estado:", error);
      setError("Error al comunicar con el servidor.");
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== account.id_usuario));
    }
  };

  // Calcular los índices de los usuarios a mostrar en la página actual
  const startIndex = (currentPage - 1) * LIMIT;
  const currentAccounts = filteredAccounts.slice(startIndex, startIndex + LIMIT);

  return (
    <div className="accounts-page">
      <h1>Cuentas</h1> {/* Título de la página */}

      {/* Barra de búsqueda con filtros */}
      <SearchBar 
        placeholder="Buscar..." 
        value={searchQuery}
        onChange={handleSearchChange}
        filters={
          <div className="filters">
            <label>Filtrar por Estatus:</label>
            <select value={selectedStatus} onChange={handleStatusChange}>
              <option value="">Todos</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>

            <label>Filtrar por Tipo de Cuenta:</label>
            <select value={selectedAccountType} onChange={handleAccountTypeChange}>
              <option value="">Todos</option>
              {accountTypeOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        } 
      />
      
      {error && <div className="error-message">{error}</div>} {/* Mensaje de error */}
      
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
                <div>
                  <button
                    className="table-button"
                    onClick={() => toggleAccountStatus(account)}
                    disabled={loadingIds.includes(account.id_usuario)}
                  >
                    {loadingIds.includes(account.id_usuario) 
                      ? 'Procesando...' 
                      : (account.estatus === 'activo' ? 'Suspender' : 'Activar')}
                  </button>
                  {/* **Modificar el Link para Incluir el ID del Usuario** */}
                  <Link to={`/editarcuenta/${account.id_usuario}`}>
                    <button className="table-button">
                      <p>Editar</p>
                    </button>
                  </Link>
                  <button className="table-button" onClick={() => handleDeleteClick(account)}>Eliminar</button>
                </div>
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
