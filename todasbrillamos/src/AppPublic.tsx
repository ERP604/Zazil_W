import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';

interface AppPublicProps {
  onLogin: () => void;
}

const AppPublic: React.FC <AppPublicProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Credenciales de ejemplo
  const validEmail = 'usuario@zazil.com';
  const validPassword = '123456789';

  const handleLoginClick = () => {
    if (email === validEmail && password === validPassword) {
      onLogin();
    } else {
      setError('Correo o contraseña incorrectos');
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
