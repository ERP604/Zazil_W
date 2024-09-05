import React, { useState } from 'react';
import '../css/Sidebar.css';

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState('Productos');

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="public/assets/logo.png" alt="Logo" />
            </div>
            <ul className="sidebar-menu">
                <li className={activeItem === 'Productos' ? 'active' : ''} onClick={() => setActiveItem('Productos')}>
                    <a href="/productos">Productos</a>
                </li>
                <li className={activeItem === 'Dashboard' ? 'active' : ''} onClick={() => setActiveItem('Dashboard')}>
                    <a href="/dashboard">Dashboard</a>
                </li>
                <li className={activeItem === 'Gestión de Cuentas' ? 'active' : ''} onClick={() => setActiveItem('Gestión de Cuentas')}>
                    <a href="/gestion-cuentas">Gestión de Cuentas</a>
                </li>
                <li className={activeItem === 'Devoluciones' ? 'active' : ''} onClick={() => setActiveItem('Devoluciones')}>
                    <a href="/devoluciones">Devoluciones</a>
                </li>
                <li className={activeItem === 'Soporte' ? 'active' : ''} onClick={() => setActiveItem('Soporte')}>
                    <a href="/soporte">Soporte</a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
