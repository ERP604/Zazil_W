import React, { useState, useEffect, ChangeEvent } from 'react';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import "../styles/forum.css";

interface Pregunta {
  id_pregunta: number;
  id_usuario: number;
  firstName: string;
  lastName: string;
  titulo: string;
  id_usuario_respuesta: number | null;
  respuesta: string | null;
  fecha_respuesta: string | null;
}

const Forum: React.FC = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preguntaToDelete, setPreguntaToDelete] = useState<Pregunta | null>(null);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [preguntaToRespond, setPreguntaToRespond] = useState<Pregunta | null>(null);
  const [responseText, setResponseText] = useState<string>('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Añadidos para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para la búsqueda
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Estado para el filtro de estatus

  // Opciones para los filtros
  const statusOptions: string[] = ['Respondida', 'Sin responder'];

  const LIMIT = 20; // Límite de preguntas por página


  // Función para obtener todas las preguntas desde el backend
  const fetchPreguntas = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación

      const response = await fetch(`/api/preguntas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: Pregunta[] = await response.json();
      setPreguntas(data);
    } catch (error) {
      console.error("Error fetching preguntas:", error);
      setError("No se pudieron cargar las preguntas.");
    }
  };

  useEffect(() => {
    fetchPreguntas();
  }, []);

  // Handlers para la búsqueda y filtros
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  // Filtrar las preguntas según la búsqueda y el estatus seleccionado
  const filteredPreguntas = preguntas.filter(pregunta => {
    const matchesSearch = pregunta.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pregunta.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pregunta.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const estatus = pregunta.id_usuario_respuesta && pregunta.respuesta && pregunta.fecha_respuesta ? 'Respondida' : 'Sin responder';
    const matchesStatus = selectedStatus ? estatus === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPreguntas.length / LIMIT);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * LIMIT;
  const currentPreguntas = filteredPreguntas.slice(startIndex, startIndex + LIMIT);

  // Funciones para manejar la eliminación
  const handleDeleteClick = (pregunta: Pregunta) => {
    setPreguntaToDelete(pregunta);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (preguntaToDelete) {
      setLoadingIds(prev => [...prev, preguntaToDelete.id_pregunta]); // Añadir ID a la lista de cargando
      try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación

        const response = await fetch(`/api/preguntas/${preguntaToDelete.id_pregunta}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setPreguntas(preguntas.filter(q => q.id_pregunta !== preguntaToDelete.id_pregunta));
          setShowDeleteModal(false);
          setPreguntaToDelete(null);
          alert('Pregunta eliminada correctamente.');
        } else {
          const errorMsg = await response.text();
          console.error("Error al eliminar la pregunta:", errorMsg);
          setError("No se pudo eliminar la pregunta.");
        }
      } catch (error) {
        console.error("Error en la solicitud de eliminación:", error);
        setError("Error al eliminar la pregunta.");
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== preguntaToDelete.id_pregunta));
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPreguntaToDelete(null);
  };

  // Funciones para manejar la respuesta
  const handleResponderClick = (pregunta: Pregunta) => {
    setPreguntaToRespond(pregunta);
    setShowRespondModal(true);
    if (pregunta.respuesta) {
      setResponseText(pregunta.respuesta);
    } else {
      setResponseText('');
    }
  };

  const handleResponseChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResponseText(e.target.value);
  };

  const confirmResponder = async () => {
    if (preguntaToRespond && responseText.trim() !== '') {
      const id_pregunta = preguntaToRespond.id_pregunta;
      const id_usuario_respuesta = Number(localStorage.getItem('id_usuario'));

      setLoadingIds(prev => [...prev, id_pregunta]); // Añadir ID a la lista de cargando
      setError(null);

      try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación

        // Determinar el método HTTP según si se está creando o editando una respuesta
        const method = preguntaToRespond.respuesta ? 'PUT' : 'POST';

        const response = await fetch(`/api/preguntas/${id_pregunta}/respuesta`, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario_respuesta,
            respuesta: responseText,
          }),
        });

        if (response.ok) {
          setPreguntas(prevPreguntas => prevPreguntas.map(q => 
            q.id_pregunta === id_pregunta ? { 
              ...q, 
              id_usuario_respuesta: Number(id_usuario_respuesta),
              respuesta: responseText, 
              fecha_respuesta: new Date().toISOString() 
            } : q
          ));
          // Resetear los estados
          setShowRespondModal(false);
          setPreguntaToRespond(null);
          setResponseText('');
          alert(preguntaToRespond.respuesta ? 'Respuesta editada exitosamente.' : 'Respuesta enviada exitosamente.');
        } else {
          const errorMsg = await response.text();
          console.error("Error al enviar la respuesta:", errorMsg);
          setError("No se pudo enviar la respuesta.");
        }
      } catch (error) {
        console.error("Error en la solicitud de respuesta:", error);
        setError("Error al enviar la respuesta.");
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== id_pregunta));
      }
    } else {
      alert('Por favor, ingresa una respuesta antes de enviar.');
    }
  };

  const cancelResponder = () => {
    setShowRespondModal(false);
    setPreguntaToRespond(null);
    setResponseText('');
  };

  return (
    <div className="forum-page">
      <h1>Foro</h1> {/* Título de la página */}

      {/* Barra de búsqueda con filtros */}
      <SearchBar 
        placeholder="Buscar por nombre o pregunta..." 
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
          </div>
        } 
      />

      {error && <div className="error-message">{error}</div>} {/* Mensaje de error */}

      <table className="forum-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Título</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPreguntas.map((pregunta) => {
            const estatus = pregunta.id_usuario_respuesta && pregunta.respuesta && pregunta.fecha_respuesta ? 'Respondida' : 'Sin responder';
            return (
              <tr key={pregunta.id_pregunta}>
                <td>{pregunta.id_pregunta}</td>
                <td>{pregunta.firstName}</td>
                <td>{pregunta.lastName}</td>
                <td>{pregunta.titulo}</td>
                <td className={estatus === 'Respondida' ? 'status-respondida' : 'status-sin-responder'}>
                  {estatus}
                </td>
                <td className="actions-cell">
                  <button 
                    className="table-button" 
                    onClick={() => handleResponderClick(pregunta)}
                    disabled={loadingIds.includes(pregunta.id_pregunta)}
                  >
                    {estatus === 'Sin responder' ? 'Responder' : 'Editar respuesta'}
                  </button>
                  <button 
                    className="table-button" 
                    onClick={() => handleDeleteClick(pregunta)}
                    disabled={loadingIds.includes(pregunta.id_pregunta)}
                  >
                    {loadingIds.includes(pregunta.id_pregunta) ? 'Procesando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            );
          })}
          {currentPreguntas.length === 0 && (
            <tr>
              <td colSpan={6}>No hay preguntas para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Modal de Confirmación para Eliminar */}
      {showDeleteModal && preguntaToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de que deseas eliminar esta pregunta?</h2>
            <p><strong>ID:</strong> {preguntaToDelete.id_pregunta}</p>
            <p><strong>Pregunta:</strong> {preguntaToDelete.titulo}</p>
            <div className="modal-buttons">
              <button className="table-button" onClick={confirmDelete}>Confirmar</button>
              <button className="table-button" onClick={cancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Responder o Editar una Pregunta */}
      {showRespondModal && preguntaToRespond && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{preguntaToRespond.respuesta ? 'Editar respuesta' : 'Responder a la Pregunta'}</h2>
            <p><strong>ID:</strong> {preguntaToRespond.id_pregunta}</p>
            <p><strong>Pregunta:</strong> {preguntaToRespond.titulo}</p>
            <textarea 
              value={responseText}
              onChange={handleResponseChange}
              placeholder="Escribe tu respuesta aquí..."
              className="response-textarea"
            />
            <div className="modal-buttons">
              <button className="table-button" onClick={confirmResponder} disabled={loadingIds.includes(preguntaToRespond.id_pregunta)}>
                {loadingIds.includes(preguntaToRespond.id_pregunta) ? 'Procesando...' : (preguntaToRespond.respuesta ? 'Guardar Cambios' : 'Enviar Respuesta')}
              </button>
              <button className="table-button" onClick={cancelResponder}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
