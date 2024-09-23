import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppPublic from './AppPublic';
import './styles/global.css';

const MainApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <React.StrictMode>
      {isAuthenticated ? <App /> : <AppPublic onLogin={handleLogin} />}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MainApp />
);
