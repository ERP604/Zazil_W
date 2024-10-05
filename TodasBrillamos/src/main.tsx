// Importar los módulos necesarios de React y ReactDOM
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Componente para usuarios autenticados
import AppPublic from './AppPublic'; // Componente para usuarios no autenticados
import './styles/global.css'; // Estilos globales

// Definición del componente principal de la aplicación
const MainApp: React.FC = () => {
  // Estado para gestionar la autenticación del usuario
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // useEffect se ejecuta al montar el componente para verificar el estado de autenticación
  useEffect(() => {
    // Obtener el estado de autenticación desde localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    // Si el estado es 'true', actualizar el estado local
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []); // El arreglo vacío indica que solo se ejecuta una vez al montar

  // Función para manejar el inicio de sesión
  const handleLogin = (token: string) => {
    setIsAuthenticated(true); // Actualizar el estado de autenticación
    localStorage.setItem('isAuthenticated', 'true'); // Guardar el estado en localStorage
    localStorage.setItem('authToken', token); // Guardar el token de autenticación
  };
  
  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsAuthenticated(false); // Actualizar el estado de autenticación
    localStorage.removeItem('isAuthenticated'); // Eliminar el estado de autenticación de localStorage
    localStorage.removeItem('authToken'); // Eliminar el token de autenticación
  };

  return (
    // Utilizar StrictMode para ayudar a detectar problemas en la aplicación
    <React.StrictMode>
      {/* Renderizar el componente correspondiente según el estado de autenticación */}
      {isAuthenticated ? <App onLogout={handleLogout} /> : <AppPublic onLogin={handleLogin} />}
    </React.StrictMode>
  );
};

// Renderizar el componente MainApp en el elemento con id 'root'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MainApp />
);
