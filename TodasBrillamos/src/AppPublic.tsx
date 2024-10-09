import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';

interface AppPublicProps {
  onLogin: (token: string) => void;
}

const AppPublic: React.FC<AppPublicProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = async () => {
    setError(''); // Limpiar errores previos

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Enviar credenciales al backend
      });

      const data = await response.json(); // Procesar la respuesta

      if (response.ok) {
        const { token } = data; // Recibir el token desde la respuesta
        localStorage.setItem('authToken', token); // Guardar el token en localStorage
        onLogin(token); // Llamar la función de login con el token
      } else {
        setError(data.message || 'Correo o contraseña incorrectos'); // Mostrar el error recibido desde el backend
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Inténtalo más tarde.'); // Manejar errores de red o conexión
    }
  };

  return (
    <div className="AppPublic">
      <AuthPage
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleLoginClick={handleLoginClick}
        error={error}
      />
    </div>
  );
};

export default AppPublic;
