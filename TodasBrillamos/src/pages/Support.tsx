import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom"; // Para la navegación y obtención de parámetros
import "../styles/accountsPage.css"; // Importar estilos

const EditarCuenta: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del usuario desde la URL
  const [accountData, setAccountData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    estatus: 'activo', // Valor por defecto
    tipo_usuario: 'Usuario', // Valor por defecto
    ruta_img: '', // Ruta de la imagen de perfil
  });
  //const [profileImage, setProfileImage] = useState<File | null>(null); // Estado para la imagen de perfil
  const [error, setError] = useState(''); // Estado para mensajes de error.
  const [success, setSuccess] = useState(''); // Estado para mensajes de éxito.

  // Función para obtener los datos de la cuenta desde el backend.
  const fetchAccountData = async () => {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      const data = await response.json();
      setAccountData({
        nombre: data.nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        estatus: data.estatus,
        tipo_usuario: data.tipo_usuario,
        ruta_img: data.ruta_img,
      });
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  // Cargar los datos de la cuenta cuando el componente se monte.
  useEffect(() => {
    fetchAccountData();
  }, [id]);

  // Manejar cambios en los inputs de texto, select, etc.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value,
    });
  };
  // Manejar la selección de la imagen principal.
/*   const handleImageProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  }; */

  // Manejar el envío del formulario (actualización de la cuenta).
  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData), // Enviar los datos de la cuenta en el cuerpo de la solicitud.
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cuenta actualizada exitosamente'); // Mensaje de éxito.
        setError(''); // Limpia cualquier mensaje de error.
      } else {
        setError(data.alert || 'Error al actualizar la cuenta'); // Muestra el error recibido.
        setSuccess(''); // Limpia el mensaje de éxito.
      }
    } catch (error) {
      setError('Error al conectar con el servidor'); // Error genérico de conexión.
    }
  };

  return (
    <div className="editar-cuenta">
      <h2>Editar Cuenta</h2>

      <form className="account-info-section" onSubmit={handleGuardarCambios}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={accountData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido Paterno</label>
          <input
            type="text"
            name="apellido_paterno"
            value={accountData.apellido_paterno}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido Materno</label>
          <input
            type="text"
            name="apellido_materno"
            value={accountData.apellido_materno}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Estatus</label>
          <select
            name="estatus"
            value={accountData.estatus}
            onChange={handleInputChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tipo de Usuario</label>
          <select
            name="tipo_usuario"
            value={accountData.tipo_usuario}
            onChange={handleInputChange}
            required
          >
            <option value="Usuario">Usuario</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div className="action-buttons">
          <Link to="/cuentas">
            <button className="atras-button">Página anterior</button>
          </Link>
          <button type="submit" className="save-button">Guardar Cambios</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default EditarCuenta;
