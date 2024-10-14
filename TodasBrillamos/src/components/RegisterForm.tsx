import React from 'react'; // Importa React.

// Define la interfaz de las propiedades que recibe el componente RegisterForm.
interface RegisterFormProps {
  name: string; // Nombre del usuario.
  email: string; // Correo electrónico del usuario.
  password: string; // Contraseña del usuario.
  setName: (name: string) => void; // Función para actualizar el nombre.
  setEmail: (email: string) => void; // Función para actualizar el correo electrónico.
  setPassword: (password: string) => void; // Función para actualizar la contraseña.
  handleRegisterClick: () => void; // Función para manejar el registro.
  toggleForm: () => void; // Función para alternar entre formularios.
}

// Componente RegisterForm que permite a los usuarios registrarse.
const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleRegisterClick,
  toggleForm,
}) => {
  // Maneja el envío del formulario.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    handleRegisterClick(); // Llama a la función para manejar el registro.
  };

  // Renderiza el formulario de registro.
  return (
    <div className="auth-container"> {/* Contenedor principal del formulario. */}
      <h1 className="app-title">Zazil</h1> {/* Título de la aplicación. */}
      <h2>Registrarse</h2> {/* Título del formulario. */}
      <form onSubmit={handleSubmit}> {/* Maneja el envío del formulario. */}
        <div className="form-group">
          <input
            type="text" // Campo para el nombre del usuario.
            id="name"
            value={name} // Valor del nombre.
            onChange={(e) => setName(e.target.value)} // Actualiza el nombre.
            placeholder="Nombre"
            required // Campo obligatorio.
          />
        </div>
        <div className="form-group">
          <input
            type="email" // Campo para el correo electrónico.
            id="email"
            value={email} // Valor del correo electrónico.
            onChange={(e) => setEmail(e.target.value)} // Actualiza el correo electrónico.
            placeholder="Correo Electrónico"
            required // Campo obligatorio.
          />
        </div>
        <div className="form-group">
          <input
            type="password" // Campo para la contraseña.
            id="password"
            value={password} // Valor de la contraseña.
            onChange={(e) => setPassword(e.target.value)} // Actualiza la contraseña.
            placeholder="Contraseña"
            required // Campo obligatorio.
          />
        </div>
        <button type="submit" className="submit-button">
          Registrarse {/* Botón para enviar el formulario. */}
        </button>
      </form>
      <p className="switch-form">
        ¿Ya tienes una cuenta? <span onClick={toggleForm}>Inicia sesión aquí</span> {/* Opción para cambiar al formulario de inicio de sesión. */}
      </p>
    </div>
  );
};

export default RegisterForm; // Exporta el componente RegisterForm para su uso en otras partes de la aplicación.
