import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../css/GestionCuentas.css';

const GestionCuentas: React.FC = () => {
    return (
        <div className="gestion-cuentas-page">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content-area">
                    <h1>Gestión de Cuentas</h1>
                    <div className="cuentas-list">
                        {/* Aquí va el contenido específico de la página de Gestión de Cuentas */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionCuentas;
