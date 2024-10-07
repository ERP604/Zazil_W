import React, { useState, useEffect } from 'react'; // Importa React y hooks useState y useEffect.
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas.
import SearchBar from '../components/SearchBar'; // Importa el componente SearchBar.
import Pagination from '../components/Pagination'; // Importa el componente Pagination.
import "../styles/accountsPage.css"; // Importa los estilos para la página de cuentas.

// Define la interfaz para el tipo de datos de las cuentas de usuario.
interface Account {
  id_usuario: number; // ID único del usuario.
  nombre: string; // Nombre del usuario.
  apellido_paterno: string; // Apellido paterno del usuario.
  apellido_materno: string; // Apellido materno del usuario.
  estatus: string; // Estado de la cuenta (activo/suspendido).
  tipo_usuario: string; // Tipo de usuario (por ejemplo, administrador, cliente, etc.).
}

// Componente principal de la página de cuentas.
const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]); // Estado para almacenar las cuentas.
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual.
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal de confirmación.
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null); // Estado para la cuenta a eliminar.
  const totalPages = 5; // Total de páginas para la paginación (puede ser dinámico en un futuro).

  useEffect(() => {
    // Función para obtener los datos de las cuentas desde la API.
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/usuario'); // Realiza la llamada a la API.
        const data = await response.json(); // Convierte la respuesta a JSON.
        setAccounts(data); // Actualiza el estado con los datos de las cuentas.
      } catch (error) {
        console.error("Error fetching accounts:", error); // Manejo de errores.
      }
    };

    fetchAccounts(); // Llama a la función para obtener los datos.
  }, []); // Se ejecuta solo una vez al montar el componente.

  // Maneja el cambio de página.
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Aquí se puede implementar lógica adicional para cargar las cuentas de la página seleccionada.
  };

  // Maneja el clic en el botón de eliminar.
  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account); // Guarda la cuenta seleccionada para eliminar.
    setShowModal(true); // Muestra el modal de confirmación.
  };

  // Confirma la eliminación de la cuenta seleccionada.
  const confirmDelete = async () => {
    if (accountToDelete) {
      try {
        console.log("Eliminando usuario con ID:", accountToDelete.id_usuario); // Imprime el ID que se va a eliminar.
  
        const response = await fetch(`/api/usuario/${accountToDelete.id_usuario}`, {
          method: 'DELETE', // Método de la solicitud HTTP.
        });
  
        if (response.ok) {
          console.log("Usuario eliminado exitosamente del frontend.");
          setAccounts(accounts.filter(acc => acc.id_usuario !== accountToDelete.id_usuario)); // Actualiza la lista de cuentas.
          setShowModal(false); // Cierra el modal.
        } else {
          const errorMsg = await response.text(); // Obtiene el mensaje de error de la respuesta.
          console.error("Error al eliminar el usuario:", errorMsg); // Manejo de errores.
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error); // Manejo de errores.
      }
    }
  };

  // Cancela la acción de eliminación.
  const cancelDelete = () => {
    setShowModal(false); // Cierra el modal.
    setAccountToDelete(null); // Resetea la cuenta seleccionada.
  };

  return (
    <div className="accounts-page"> {/* Contenedor principal de la página. */}
      <h1>Cuentas</h1> {/* Título de la página. */}
      <SearchBar 
        placeholder="Buscar..." 
        filters={ // Sección de filtros de búsqueda.
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
      <table className="accounts-table"> {/* Tabla para mostrar las cuentas. */}
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
          {accounts.map((account) => ( // Mapea las cuentas para crear filas en la tabla.
            <tr key={account.id_usuario}>
              <td>{account.id_usuario}</td>
              <td>{account.nombre}</td>
              <td>{account.apellido_paterno} {account.apellido_materno}</td>
              <td className={account.estatus === 'activo' ? 'account-active' : 'account-suspended'}>
                {account.estatus}
              </td>
              <td>{account.tipo_usuario}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteClick(account)}>Eliminar</button> {/* Botón para eliminar cuenta. */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> {/* Componente de paginación. */}

      <div className="add-admin-container">
        <Link to="/añadiradministrador">
          <button className="add-admin-button">
            <p>Agregar Administrador</p> {/* Botón para agregar un nuevo administrador. */}
          </button>
        </Link>
      </div>

      {showModal && ( // Modal de confirmación de eliminación.
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar esta cuenta?</h2>
            <p>Cuenta: {accountToDelete?.nombre} {accountToDelete?.apellido_paterno}</p>
            <button onClick={confirmDelete}>Confirmar</button> {/* Botón para confirmar la eliminación. */}
            <button onClick={cancelDelete}>Cancelar</button> {/* Botón para cancelar la eliminación. */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage; // Exporta el componente para usarlo en otras partes de la aplicación.
