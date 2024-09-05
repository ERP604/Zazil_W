import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../css/Productos.css';

const Productos: React.FC = () => {
    return (
        <div className="productos-page">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content-area">
                    <h1>Productos</h1>
                    <div className="productos-grid">
                        {/* Aquí va el contenido específico de la página de productos */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Productos;
