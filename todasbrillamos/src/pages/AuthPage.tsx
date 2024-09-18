import React from 'react';
import AuthToggle from '../components/AuthToggle';
import '../styles/auth.css';

const AuthPage: React.FC = () => {
  return (
    <div className="auth-page-container">
      <AuthToggle />
    </div>
  );
};

export default AuthPage;
