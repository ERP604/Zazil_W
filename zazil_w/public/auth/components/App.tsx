import React, { useState } from 'react'; // Importa useState desde react
import Header from './Header';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import '../css/App.css';

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="container">
      <Header />
      {showLogin ? <LoginForm /> : <RegisterForm />}
      <button onClick={() => setShowLogin(!showLogin)} className="toggle-button">
        {showLogin ? "Ir a Registro" : "Ir a Inicio de Sesión"}
      </button>
    </div>
  );
}

export default App;
