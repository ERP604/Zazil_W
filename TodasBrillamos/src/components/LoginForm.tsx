import React from 'react'; // Importa React.

// Define la interfaz de las propiedades que recibe el componente LoginForm.
interface LoginFormProps {
  email: string; // Correo electrónico del usuario.
  password: string; // Contraseña del usuario.
  setEmail: (email: string) => void; // Función para actualizar el correo electrónico.
  setPassword: (password: string) => void; // Función para actualizar la contraseña.
  handleLoginClick: () => void; // Función para manejar el inicio de sesión.
  error: string; // Mensaje de error, si lo hay.
  toggleForm: () => void; // Función para alternar entre formularios.
}

// Componente LoginForm que permite a los usuarios iniciar sesión.
const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLoginClick,
  error,
  toggleForm,
}) => {
  // Maneja el envío del formulario.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.
    handleLoginClick(); // Llama a la función para manejar el inicio de sesión.
  };

  // Renderiza el formulario de inicio de sesión.
  return (
    <div className="auth-container"> {/* Contenedor principal del formulario. */}
      <h1 className="app-title">Zazil</h1> {/* Título de la aplicación. */}
      <h2>Iniciar Sesión</h2> {/* Título del formulario. */}
      <form onSubmit={handleSubmit}> {/* Maneja el envío del formulario. */}
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
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra el mensaje de error si existe. */}
        <p className="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a> {/* Enlace para recuperar la contraseña. */}
        </p>
        <button type="submit" className="submit-button">
          Iniciar sesión {/* Botón para enviar el formulario. */}
        </button>
      </form>
      <p className="switch-form">
        ¿No tienes una cuenta? <span onClick={toggleForm}>Regístrate aquí</span> {/* Opción para cambiar al formulario de registro. */}
      </p>
    </div>
  );
};

export default LoginForm; // Exporta el componente LoginForm para su uso en otras partes de la aplicación.
