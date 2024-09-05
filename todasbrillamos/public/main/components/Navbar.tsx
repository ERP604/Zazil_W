import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-brand">
                    <img src="public/assets/TodasBrillamosTexto.jpeg" alt="Logo" />
                </div>
                <div className="navbar-links">
                    <a href="/" className={location.pathname === "/" ? "active" : ""}>Inicio</a>
                    <a href="/publicaciones" className={location.pathname === "/publicaciones" ? "active" : ""}>Publicaciones</a>
                    <a href="/administradores" className={location.pathname === "/administradores" ? "active" : ""}>Administradores</a>
                </div>
            </div>
            <div className="navbar-center">
                <div className="navbar-search">
                    <input type="text" placeholder="Search" />
                    <button className="icon-button">
                        <img src="public/assets/lupa.png" alt="Search" />
                    </button>
                </div>
            </div>
            <div className="navbar-right">
                <button className="icon-button">
                    <img src="public/assets/notificaciones.png" alt="Notificaciones" />
                </button>
                <button className="icon-button">
                    <img src="public/assets/perfil.png" alt="Perfil" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
