import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthToggleProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLoginClick: () => void;
  error: string;
}

const AuthToggle: React.FC<AuthToggleProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLoginClick,
  error,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleRegisterClick = () => {
    console.log('Usuario registrado:', { name, email, password });
    toggleForm();
  };

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

export default AuthToggle;
