import React from 'react';

interface LoginFormProps {
  toggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggleForm }) => {
  return (
    <div className="auth-container">
      <h1 className="app-title">Zazil</h1>
      <h2>Iniciar Sesión</h2>
      <form>
        <div className="form-group">
          <input type="email" id="email" placeholder="Correo Electrónico" required />
        </div>
        <div className="form-group">
          <input type="password" id="password" placeholder="Contraseña" required />
        </div>
        <p className="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </p> {/* Enlace de "Olvidaste tu contraseña" */}
        <button type="submit" className="submit-button">Iniciar sesión</button>
      </form>
      <p className="switch-form">
        ¿No tienes una cuenta? <span onClick={toggleForm}>Regístrate aquí</span>
      </p>
    </div>
  );
};

export default LoginForm;
