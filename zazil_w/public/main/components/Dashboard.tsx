import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../css/Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content-area">
                    <h1>Dashboard</h1>
                    <div className="dashboard-stats">
                        {/* Aquí va el contenido específico del Dashboard */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
