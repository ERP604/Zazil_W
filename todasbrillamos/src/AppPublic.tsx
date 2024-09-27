import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';

interface AppPublicProps {
  onLogin: (token: string) => void;
}

const AppPublic: React.FC<AppPublicProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Credenciales de ejemplo
  const validEmail = 'usuario@zazil.com';
  const validPassword = '123456789';

  const handleLoginClick = () => {
    if (email === validEmail && password === validPassword) {
      const fakeToken = 'token123456'; // Genera o recibe un token real según tu backend
      onLogin(fakeToken);
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
