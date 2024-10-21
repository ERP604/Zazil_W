import React, { useState } from 'react'; // Importa React y el hook useState.
import LoginForm from './LoginForm'; // Importa el componente LoginForm.
import RegisterForm from './RegisterForm'; // Importa el componente RegisterForm.

// Define las propiedades que recibe el componente AuthToggle.
interface AuthToggleProps {
  email: string; // Correo electrónico del usuario.
  password: string; // Contraseña del usuario.
  setEmail: (email: string) => void; // Función para actualizar el correo electrónico.
  setPassword: (password: string) => void; // Función para actualizar la contraseña.
  handleLoginClick: () => void; // Función para manejar el inicio de sesión.
  error: string; // Mensaje de error.
}

// Componente AuthToggle que permite alternar entre inicio de sesión y registro.
const AuthToggle: React.FC<AuthToggleProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLoginClick,
  error,
}) => {
  const [isLogin, setIsLogin] = useState(true); // Estado para determinar el formulario activo.
  const [name, setName] = useState(''); // Estado para el nombre del usuario.

  // Alterna entre los formularios de inicio de sesión y registro.
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Maneja el clic en el botón de registro.
  const handleRegisterClick = () => {
    console.log('Usuario registrado:', { name, email, password });
    toggleForm();
  };

  // Renderiza el formulario correspondiente según el estado isLogin.
  return (
    <div className="auth-page">
      {isLogin ? (
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLoginClick={handleLoginClick}
          error={error}
          toggleForm={toggleForm}
        />
      ) : (
        <RegisterForm
          name={name}
          email={email}
          password={password}
          setName={setName}
          setEmail={setEmail}
          setPassword={setPassword}
          handleRegisterClick={handleRegisterClick}
          toggleForm={toggleForm}
        />
      )}
    </div>
  );
};

export default AuthToggle; // Exporta el componente para su uso en otras partes de la aplicación.
