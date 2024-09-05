import React from 'react';
import '../css/RegisterForm.css';

const RegisterForm: React.FC = () => {
  return (
    <div className="form-container">
      <h2 className="form-title">Regístrate</h2>
      <form className="form">
        <input type="text" placeholder="Nombre" className="input" />
        <input type="email" placeholder="Email" className="input" />
        <input type="password" placeholder="Contraseña" className="input" />
        <button type="submit" className="register-button">Regístrate</button>
      </form>
      <div className="terms">
        <label className="checkbox">
          <input type="checkbox" />
          <a href="#terms" className="terms-link">Términos y condiciones</a>
        </label>
      </div>
    </div>
  );
};

export default RegisterForm;