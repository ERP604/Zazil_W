import React from 'react';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard__overview">
        <div className="card">
          <p>Clientes</p>
          <h2>500</h2>
          <i className="fas fa-users"></i>
        </div>

        <div className="card">
          <p>Ventas del año</p>
          <h2>$13500.89</h2>
          <i className="fas fa-chart-line"></i>
        </div>

        <div className="card">
          <p>Gastos</p>
          <h2>-$5500.70</h2>
          <i className="fas fa-chart-pie"></i>
        </div>
      </div>

      <div className="dashboard__charts">
        <div className="chart">
          <h3>Más vendidos</h3>
          {/* Aquí irá el componente de la gráfica de más vendidos */}
        </div>

        <div className="chart">
          <h3>Menos vendidos</h3>
          {/* Aquí irá el componente de la gráfica de menos vendidos */}
        </div>

        <div className="chart">
          <h3>Visitas de la semana</h3>
          {/* Aquí irá el componente de la gráfica de visitas */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
