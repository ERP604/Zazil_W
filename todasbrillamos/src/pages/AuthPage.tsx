import React from 'react';
import AuthToggle from '../components/AuthToggle';
import '../styles/auth.css';

interface AuthPageProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLoginClick: () => void;
  error: string;
}

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
