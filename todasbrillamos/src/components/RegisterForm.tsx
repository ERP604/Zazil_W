import React from 'react';

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleRegisterClick: () => void;
  toggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleRegisterClick,
  toggleForm,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegisterClick();
  };

  return (
    <div className="auth-container">
      <h1 className="app-title">Zazil</h1>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
          />
        </div>
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
        <button type="submit" className="submit-button">
          Registrarse
        </button>
      </form>
      <p className="switch-form">
        ¿Ya tienes una cuenta? <span onClick={toggleForm}>Inicia sesión aquí</span>
      </p>
    </div>
  );
};

export default RegisterForm;
