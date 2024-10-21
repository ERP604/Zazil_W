import React from 'react';
import AuthToggle from '../components/AuthToggle';
import '../styles/auth.css';
// Interfaz de las propiedades del componente
interface AuthPageProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLoginClick: () => void;
  error: string;
}
// Componente funcional que recibe las propiedades de la interfaz
const AuthPage: React.FC<AuthPageProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLoginClick,
  error,
}) => {
  return (
    <div className="auth-page-container">
      {/* Pasa las props al componente AuthToggle */}
      <AuthToggle
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

export default AuthPage;
