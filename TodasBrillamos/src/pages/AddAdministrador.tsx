import React, { useState } from 'react'; 
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas.
import '../styles/addAdministrador.css'; // Importa los estilos del componente.

const AnadirAdministrador: React.FC = () => {
  // Estado inicial del nuevo usuario.
  const [user, setUser] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    f_nacimiento: '',
    tipo_usuario: 'administrador', // Valor predeterminado según la imagen.
    email: '',
    password: ''
  });

  const [profileImage, setProfileImage] = useState<File | null>(null); // Estado para la imagen de perfil.
  const [error, setError] = useState(''); // Estado para manejar mensajes de error.
  const [success, setSuccess] = useState(''); // Estado para manejar mensajes de éxito.

  // Maneja cambios en los campos de entrada.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value // Actualiza el estado del usuario.
    });
  };

  // Maneja la selección de imagen.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]); // Establece la imagen de perfil seleccionada.
    }
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    try {
        const formData = new FormData(); // Crea un nuevo objeto FormData.
        formData.append('nombre', user.nombre);
        formData.append('apellido_paterno', user.apellido_paterno);
        formData.append('apellido_materno', user.apellido_materno);
        formData.append('f_nacimiento', user.f_nacimiento);
        formData.append('tipo_usuario', user.tipo_usuario);
        formData.append('email', user.email);
        formData.append('password', user.password);

        if(profileImage) {
        formData.append('profileImage', profileImage); // Añade la imagen de perfil.
        }

        const response = await fetch('/api/register', {
          method: 'POST', // Método de la solicitud.
          body: formData // Envía los datos como FormData para manejar archivos.
        });

        const data = await response.json(); // Convierte la respuesta a JSON.

        if (response.ok) {
          setSuccess('Usuario registrado exitosamente'); // Mensaje de éxito.
          setError(''); // Resetea el mensaje de error.
        } else {
          setError(data.alert || 'Error al registrar'); // Establece un mensaje de error.
          setSuccess(''); // Resetea el mensaje de éxito.
        }
      }catch (error) {
        setError('Error al registrar el usuario'); // Mensaje de error.
  }
};

  return (
    <div className="account-settings-container">
      <h2 className="title">Añadir Administrador</h2>
      <div className="settings-content">
      <div className="image-upload-section">
          <div className="profile-image">
            {profileImage ? (
              <img src={URL.createObjectURL(profileImage)} alt="Imagen Usuario" className="image-preview" />
            ) : (
              <div className="image-placeholder">Imagen Principal</div> // Placeholder para la imagen.
            )}
          </div>

          <div className="image-upload-card small-button">
            <label htmlFor="main-image-upload">
              <p>Agregar Imagen Principal</p>
            </label>
            <input
              type="file"
              id="main-image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }} // Oculta el input de archivo.
            />
          </div>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={user.nombre}
                onChange={handleInputChange} // Maneja cambios en el campo.
              />
            </div>
            <div className="input-group">
              <label>Apellido Paterno</label>
              <input
                type="text"
                name="apellido_paterno"
                value={user.apellido_paterno}
                onChange={handleInputChange} // Maneja cambios en el campo.
              />
            </div>
            <div className="input-group">
              <label>Apellido Materno</label>
              <input
                type="text"
                name="apellido_materno"
                value={user.apellido_materno}
                onChange={handleInputChange} // Maneja cambios en el campo.
              />
            </div>
            <div className="input-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="f_nacimiento"
                value={user.f_nacimiento}
                onChange={handleInputChange} // Maneja cambios en el campo.
              />
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange} // Maneja cambios en el campo.
              />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputChange} // Maneja cambios en el campo.
              />
            </div>

            <div className="button-group">
              <Link to="/soporte">
                <button type="button" className="atras-btn">Página anterior</button> {/* Botón para regresar. */}
              </Link>
              <button type="submit" className="save-changes-btn">Guardar Cambios</button> {/* Botón para enviar el formulario. */}
            </div>

            {error && <div className="error-message">{error}</div>} {/* Mensaje de error. */}
            {success && <div className="success-message">{success}</div>} {/* Mensaje de éxito. */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnadirAdministrador; // Exporta el componente para usarlo en otras partes de la aplicación.
