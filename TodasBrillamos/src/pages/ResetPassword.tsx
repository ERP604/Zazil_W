import React, { useState } from 'react';
import '../styles/resetPassword.css';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="reset-password">
      <div className="form-container">
        <h1 className="app-title">Zazil</h1>
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Enviar enlace</button>
        </form>
        <div className="back-to-login">
          <a href="/">Volver al inicio de sesión</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;