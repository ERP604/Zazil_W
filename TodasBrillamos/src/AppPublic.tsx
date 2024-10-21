import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

interface AppPublicProps {
  onLogin: (token: string) => void;
}

const AppPublic: React.FC<AppPublicProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = async () => {
    setError('');
  
    try {
      const response = await fetch('/api/loginadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { token, id_usuario } = data; // Asegúrate de obtener el id_usuario desde el backend
        localStorage.setItem('authToken', token);
        localStorage.setItem('id_usuario', id_usuario); // Guarda el id_usuario en localStorage
        onLogin(token);
  
        // Obtener información del usuario logueado
        const userResponse = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`, // Incluimos el token en el header
          },
        });
  
        const userData = await userResponse.json();
  
        if (userResponse.ok) {
          localStorage.setItem('userId', userData.id_usuario); // Guardar el ID del usuario logueado
          console.log('Usuario logueado:', userData); // Registro para debug
        } else {
          setError('Error al obtener los datos del usuario.');
          console.error('Error al obtener usuario:', await userResponse.text()); // Registro del error
        }
      } else {
        setError(data.message || 'Correo o contraseña incorrectos');
        console.warn('Error de login:', data.message); // Registro del error de login
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Inténtalo más tarde.');
      console.error('Error de conexión:', error); // Registro de posibles errores de red
    }
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para la página de autenticación */}
        <Route
          path="/"
          element={
            <AuthPage
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              handleLoginClick={handleLoginClick}
              error={error}
            />
          }
        />
        {/* Ruta para la página de recuperación de contraseña */}
      </Routes>
    </Router>
  );
};

export default AppPublic;