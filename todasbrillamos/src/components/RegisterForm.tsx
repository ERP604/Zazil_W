import React from 'react';

interface RegisterFormProps {
  toggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
  return (
    <div className="auth-container">
      <h1 className="app-title">Zazil</h1> {/* Título añadido */}
      <h2>Registrarse</h2>
      <form>
        <div className="form-group">
          <input type="text" id="name" placeholder="Nombre" required />
        </div>
        <div className="form-group">
          <input type="email" id="email" placeholder="Correo Electrónico" required />
        </div>
        <div className="form-group">
          <input type="password" id="password" placeholder="Contraseña" required />
        </div>
        <button type="submit" className="submit-button">Registrarse</button>
      </form>
      <p className="switch-form">
        ¿Ya tienes una cuenta? <span onClick={toggleForm}>Inicia sesión aquí</span>
      </p>
    </div>
  );
};

export default RegisterForm;
