import React from 'react';
import '../css/LoginForm.css';

const LoginForm: React.FC = () => {
  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form>
        <div className="input-container">
          <input type="email" id="email" name="email" placeholder="Email" required />
        </div>
        <div className="input-container">
          <input type="password" id="password" name="password" placeholder="Contraseña" required />
        </div>
        <button type="submit" className="login-button">Inicio de sesión</button>
      </form>
      <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
    </div>
  );
}

export default LoginForm;
