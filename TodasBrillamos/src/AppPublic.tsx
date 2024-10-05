import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';

interface AppPublicProps {
  onLogin: (token: string) => void; // Propiedad para manejar el login y guardar el token
}

const AppPublic: React.FC<AppPublicProps> = ({ onLogin }) => {
  const [email, setEmail] = useState(''); // Estado para almacenar el email ingresado
  const [password, setPassword] = useState(''); // Estado para almacenar la contraseña ingresada
  const [error, setError] = useState(''); // Estado para mostrar errores de login

  const handleLoginClick = async () => {
    setError(''); // Limpiar errores previos

    try {
      console.log('Realizando login con:', { email, password }); // Imprimir credenciales en la consola (solo para desarrollo)
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Enviar el email y la contraseña en el cuerpo de la solicitud
      });

      const data = await response.json(); // Procesar la respuesta

      if (response.ok) {
        const faketoken = 'fake-token'; // Token de prueba
        onLogin(faketoken); // Llamar la función de login con el token
      } else {
        setError(data.message || 'Correo o contraseña incorrectos'); // Mostrar el error recibido desde el backend
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Inténtalo más tarde.'); // Manejar errores de red o conexión
    }
  };

  return (
    <div className="AppPublic">
      {/* Componente de la página de autenticación */}
      <AuthPage
        email={email} // Pasar el email como prop
        password={password} // Pasar la contraseña como prop
        setEmail={setEmail} // Pasar la función para actualizar el email
        setPassword={setPassword} // Pasar la función para actualizar la contraseña
        handleLoginClick={handleLoginClick} // Pasar la función de login
        error={error} // Mostrar el mensaje de error
      />
    </div>
  );
};

export default AppPublic;
