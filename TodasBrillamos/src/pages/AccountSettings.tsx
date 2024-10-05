import React, { useState, useEffect } from 'react'; // Importa React y hooks useState y useEffect.
import '../styles/accoutSettings.css'; // Importa los estilos para la página de ajustes de cuenta.

// Componente AccountSettings que permite al usuario modificar su información de cuenta.
const AccountSettings = () => {
  // Estado para almacenar los datos del usuario.
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Estado para manejar la imagen de perfil.
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Hook useEffect para simular la carga de datos del usuario.
  useEffect(() => {
    try {
      // Función para simular la llamada a la API para obtener datos del usuario.
      const fetchUserData = () => {
        setUser({
          name: 'Nombre del usuario', // Nombre simulado.
          email: 'usuario@ejemplo.com', // Correo simulado.
          password: '********' // Contraseña simulada.
        });
      };
      
      fetchUserData(); // Llama a la función para cargar los datos.
    } catch (error) {
      console.error('Error fetching user data:', error); // Manejo de errores.
    }
  }, []); // Se ejecuta solo una vez al montar el componente.

  // Maneja los cambios en los campos de entrada.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value // Actualiza el estado del usuario según el nombre del campo.
    });
  };

  // Maneja el cambio de la imagen de perfil.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]); // Actualiza la imagen de perfil seleccionada.
    }
  };

  // Si el usuario no está definido, muestra un mensaje de carga.
  if (!user) {
    return <div>Loading...</div>;
  }

  // Renderiza el formulario de ajustes de cuenta.
  return (
    <div className="account-settings-container"> {/* Contenedor principal de los ajustes. */}
      <h2 className="title">Ajustes</h2> {/* Título de la sección. */}
      <div className="settings-content">
        <div className="image-section"> {/* Sección para la imagen de perfil. */}
          <div className="profile-image">
            <img 
              src={profileImage ? URL.createObjectURL(profileImage) : ""} // Muestra la imagen de perfil si está seleccionada.
              alt="Profile" 
            />
          </div>
          <label htmlFor="profile-image-upload" className="change-image-btn">
            Cambiar Imagen {/* Botón para cambiar la imagen de perfil. */}
          </label>
          <input
            type="file"
            id="profile-image-upload" // Campo oculto para cargar imágenes.
            accept="image/*" // Acepta solo archivos de imagen.
            onChange={handleImageChange} // Maneja el cambio de la imagen.
            style={{ display: 'none' }} // Oculta el campo de entrada.
          />
        </div>

        <div className="form-section"> {/* Sección para el formulario de datos. */}
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={user.name} // Valor del campo de nombre.
              onChange={handleInputChange} // Maneja el cambio en el campo.
            />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={user.email} // Valor del campo de correo electrónico.
              onChange={handleInputChange} // Maneja el cambio en el campo.
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={user.password} // Valor del campo de contraseña.
              onChange={handleInputChange} // Maneja el cambio en el campo.
            />
          </div>

          <div className="button-group">
            <button type="submit" className="edit-profile-btn">Editar Perfil</button> {/* Botón para editar el perfil. */}
            <button type="submit" className="save-changes-btn">Guardar Cambios</button> {/* Botón para guardar cambios. */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; // Exporta el componente para usarlo en otras partes de la aplicación.
