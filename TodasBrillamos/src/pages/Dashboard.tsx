import React from 'react';
import { FaUsers, FaChartLine, FaArrowDown } from 'react-icons/fa'; // Iconos para las tarjetas
import { Bar, Line } from 'react-chartjs-2'; // Gráficos de barras y líneas
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js'; // Componentes necesarios para gráficos
import '../styles/dashboard.css'; // Importación de los estilos del Dashboard

// Registro de los componentes de Chart.js que se van a utilizar
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard: React.FC = () => {
  // Datos de ejemplo para la gráfica de barras (Más vendidos)
  const barData = {
    labels: ['Technology', 'Car Brands', 'Airlines', 'Energy'], // Categorías de productos
    datasets: [
      {
        label: '2022', // Año 2022
        backgroundColor: '#e57373', // Color de las barras
        data: [65, 59, 80, 81], // Valores de ventas para 2022
      },
      {
        label: '2023', // Año 2023
        backgroundColor: '#64b5f6', // Color de las barras
        data: [48, 48, 70, 79], // Valores de ventas para 2023
      },
      {
        label: '2024', // Año 2024
        backgroundColor: '#81c784', // Color de las barras
        data: [58, 58, 91, 86], // Valores de ventas para 2024
      },
    ],
  };

  // Datos de ejemplo para la gráfica de líneas (Menos vendidos y Visitas de la semana)
  const lineData = {
    labels: ['Technology', 'Car Brands', 'Airlines', 'Energy'], // Categorías de productos
    datasets: [
      {
        label: '2022', // Año 2022
        borderColor: '#e57373', // Color de la línea
        fill: true, // Indica si el área bajo la línea estará rellena
        data: [65, 59, 80, 81], // Valores de ventas o visitas para 2022
      },
      {
        label: '2023', // Año 2023
        borderColor: '#64b5f6', // Color de la línea
        fill: true, // Indica si el área bajo la línea estará rellena
        data: [48, 48, 70, 79], // Valores de ventas o visitas para 2023
      },
      {
        label: '2024', // Año 2024
        borderColor: '#81c784', // Color de la línea
        fill: true, // Indica si el área bajo la línea estará rellena
        data: [58, 58, 91, 86], // Valores de ventas o visitas para 2024
      },
    ],
  };

  // Renderizado del componente Dashboard
  return (
    <div className="dashboard">
      {/* Título principal del Dashboard */}
      <h1 className="dashboard__title">Dashboard</h1>

      {/* Sección de resumen de métricas */}
      <div className="dashboard__overview">
        {/* Tarjeta de Clientes */}
        <div className="card">
          <p>Clientes</p>
          <h2>500</h2> {/* Número de clientes */}
          <FaUsers className="card__icon" /> {/* Icono de usuarios */}
        </div>

        {/* Tarjeta de Ventas */}
        <div className="card">
          <p>Ventas del año</p>
          <h2>$13500.89</h2> {/* Ventas del año */}
          <FaChartLine className="card__icon" /> {/* Icono de línea de crecimiento */}
        </div>

        {/* Tarjeta de Gastos */}
        <div className="card">
          <p>Gastos</p>
          <h2>-$5500.70</h2> {/* Gastos totales */}
          <FaArrowDown className="card__icon" /> {/* Icono de flecha hacia abajo */}
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="dashboard__charts">
        {/* Gráfico de barras (Más vendidos) */}
        <div className="chart">
          <h3>Más vendidos</h3>
          <Bar data={barData} options={{ responsive: true }} /> {/* Gráfico de barras */}
        </div>

        {/* Gráfico de líneas (Menos vendidos) */}
        <div className="chart">
          <h3>Menos vendidos</h3>
          <Line data={lineData} options={{ responsive: true }} /> {/* Gráfico de líneas */}
        </div>

        {/* Gráfico de líneas (Visitas de la semana) */}
        <div className="chart">
          <h3>Visitas de la semana</h3>
          <Line data={lineData} options={{ responsive: true }} /> {/* Gráfico de líneas */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
