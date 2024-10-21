import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../styles/accoutSettings.css";

// Interfaz que define la estructura de los datos de un usuario
interface User {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  f_nacimiento: string;
  tipo_usuario: string;
  email: string;
  ruta_img: string;
}

// Componente funcional que permite al usuario editar la configuración de su cuenta
const AccountSettings: React.FC = () => {
  // Extrae el parámetro "id" de la URL
  const { id } = useParams<{ id: string }>();

  // Estado para almacenar los datos del usuario
  const [user, setUser] = useState<User>({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    f_nacimiento: '',
    tipo_usuario: 'administrador', // Valor predeterminado del tipo de usuario
    email: '',
    ruta_img: '',
  });

  // Estado para manejar la imagen del perfil
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Estado para manejar los mensajes de error, éxito y el estado de carga
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  // Función para formatear una fecha en formato "YYYY-MM-DD"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // Función para obtener los datos del usuario del servidor
  const fetchUserData = async () => {
    if (!id) {
      setError('No se proporcionó el ID del usuario.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/usuario/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          nombre: data.nombre || '',
          apellido_paterno: data.apellido_paterno || '',
          apellido_materno: data.apellido_materno || '',
          f_nacimiento: data.f_nacimiento ? formatDate(data.f_nacimiento) : '',
          tipo_usuario: data.tipo_usuario || 'administrador',
          email: data.email || '',
          ruta_img: data.ruta_img || '',
        });
      } else {
        setError('Error al cargar los datos del usuario');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del usuario');
    }
  };

  // Se llama a fetchUserData cuando el componente se monta o cambia el ID del usuario
  useEffect(() => {
    fetchUserData();
  }, [id]);

  // Función para manejar los cambios en los campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Función para manejar el cambio de imagen del perfil
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Función para guardar los cambios en los datos del usuario
  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError('No se proporcionó el ID del usuario.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/usuario/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: user.nombre,
          apellido_paterno: user.apellido_paterno,
          apellido_materno: user.apellido_materno,
          f_nacimiento: user.f_nacimiento,
          tipo_usuario: user.tipo_usuario,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuario actualizado exitosamente');
        setError('');
        fetchUserData(); // Recarga los datos del usuario
      } else {
        setError(data.alert || 'Error al actualizar el usuario');
        setSuccess('');
      }
    } catch (error) {
      console.error(error);
      setError('Error al conectar con el servidor');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar la imagen de perfil
  const handleGuardarImagen = async () => {
    if (!profileImage) {
      setError('Selecciona una imagen para actualizar');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', profileImage);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/usuario/${id}/img`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Imagen actualizada exitosamente');
        setError('');
        fetchUserData(); // Recarga los datos del usuario
      } else {
        setError(data.alert || 'Error al actualizar la imagen');
        setSuccess('');
      }
    } catch (error) {
      console.error(error);
      setError('Error al conectar con el servidor');
      setSuccess('');
    }
  };

  // Estructura del componente que renderiza la interfaz
  return (
    <div className="account-settings">
      <h2>Editar Cuenta</h2>
      <div className="account-settings-container">
        <div className="image-upload-section">
          <div className="image-preview-card">
            {profileImage ? (
              <img src={URL.createObjectURL(profileImage)} alt="Imagen Principal" className="image-preview" />
            ) : (
              <img src={`/api/imagenes_usuario/${user.ruta_img}`} alt="Imagen actual del usuario" className="image-preview" />
            )}
          </div>
          <div className="image-upload-card small-button">
            <label htmlFor="main-image-upload">
              <p>Modificar Imagen Principal</p>
            </label>
            <input
              type="file"
              id="main-image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <button type="button" className="save-image-button" onClick={handleGuardarImagen}>
            Guardar Imagen
          </button>
        </div>

        <form className="user-info-section" onSubmit={handleGuardarCambios}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={user.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido Paterno</label>
            <input
              type="text"
              name="apellido_paterno"
              value={user.apellido_paterno}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido Materno</label>
            <input
              type="text"
              name="apellido_materno"
              value={user.apellido_materno}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={user.email}
              readOnly
            />
          </div>
          <div className="action-buttons">
            <Link to="/cuentas">
              <button type="button" className="atras-button">Página Anterior</button>
            </Link>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
