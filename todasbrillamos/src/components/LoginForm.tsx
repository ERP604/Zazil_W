import React from 'react';

interface LoginFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLoginClick: () => void;
  error: string;
  toggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLoginClick,
  error,
  toggleForm,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginClick();
  };

  return (
    <div className="auth-container">
      <h1 className="app-title">Zazil</h1>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra el error si existe */}
        <p className="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </p>
        <button type="submit" className="submit-button">
          Iniciar sesión
        </button>
      </form>
      <p className="switch-form">
        ¿No tienes una cuenta? <span onClick={toggleForm}>Regístrate aquí</span>
      </p>
    </div>
  );
};

export default LoginForm;
