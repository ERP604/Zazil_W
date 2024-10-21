import React, { useEffect, useState } from 'react';
import { FaUsers, FaDollarSign } from 'react-icons/fa'; // Iconos para las tarjetas
import { Bar } from 'react-chartjs-2'; // Gráfico de barras
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Componentes necesarios para gráficos
import '../styles/dashboard.css'; // Importación de los estilos del Dashboard

// Registro de los componentes de Chart.js que se van a utilizar
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Definición de la interfaz para los productos
interface Producto {
  id_producto: number;
  nombre_producto: string;
  categoria: string;
  total_vendido: number;
}

const Dashboard: React.FC = () => {
  // Estados para almacenar los datos obtenidos de las APIs
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [totalVentasAnio, setTotalVentasAnio] = useState<number>(0);
  const [productosMasVendidos, setProductosMasVendidos] = useState<Producto[]>([]);
  const [productosMenosVendidos, setProductosMenosVendidos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener Total Clientes
        const responseClientes = await fetch('/api/totalUsuariosN');
        if (!responseClientes.ok) throw new Error('Error fetching total clientes');
        const dataClientes = await responseClientes.json();
        setTotalClientes(dataClientes.total);

        // Obtener Total Ventas del Año
        const responseVentas = await fetch('/api/ventas/anio');
        if (!responseVentas.ok) throw new Error('Error fetching total ventas del año');
        const dataVentas = await responseVentas.json();
        setTotalVentasAnio(dataVentas.totalVentas);

        // Obtener Productos Más Vendidos
        const responseMasVendidos = await fetch('/api/productos/mas-vendidos');
        if (!responseMasVendidos.ok) throw new Error('Error fetching productos más vendidos');
        const dataMasVendidos = await responseMasVendidos.json();
        setProductosMasVendidos(dataMasVendidos.productosMasVendidos || []);

        // Obtener Productos Menos Vendidos
        const responseMenosVendidos = await fetch('/api/productos/menos-vendidos');
        if (!responseMenosVendidos.ok) throw new Error('Error fetching productos menos vendidos');
        const dataMenosVendidos = await responseMenosVendidos.json();
        setProductosMenosVendidos(dataMenosVendidos.productosMenosVendidos || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Definición de colores para las gráficas
  const coloresMasVendidos = ['#ea93b9', '#df5c96'];
  const coloresMenosVendidos = ['#acc2e3', '#82a4d4'];

  // Datos para la gráfica de productos más vendidos (Bar Chart)
  const barDataMasVendidos = {
    labels: productosMasVendidos.length > 0 ? productosMasVendidos.map((p: Producto) => p.nombre_producto) : [],
    datasets: [
      {
        label: 'Cantidad Vendida',
        backgroundColor: productosMasVendidos.map((_, index) => coloresMasVendidos[index % coloresMasVendidos.length]),
        data: productosMasVendidos.length > 0 ? productosMasVendidos.map((p: Producto) => p.total_vendido) : [],
      },
    ],
  };

  const barOptionsMasVendidos = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Productos Más Vendidos',
      },
    },
  };

  // Datos para la gráfica de productos menos vendidos (Bar Chart)
  const barDataMenosVendidos = {
    labels: productosMenosVendidos.length > 0 ? productosMenosVendidos.map((p: Producto) => p.nombre_producto) : [],
    datasets: [
      {
        label: 'Cantidad Vendida',
        backgroundColor: productosMenosVendidos.map((_, index) => coloresMenosVendidos[index % coloresMenosVendidos.length]),
        data: productosMenosVendidos.length > 0 ? productosMenosVendidos.map((p: Producto) => p.total_vendido) : [],
      },
    ],
  };

  const barOptionsMenosVendidos = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Productos Menos Vendidos',
      },
    },
  };

  return (
    <div className="dashboard">
      {/* Título principal del Dashboard */}
      <h1 className="dashboard__title">Dashboard</h1>

      {/* Sección de resumen de métricas */}
      <div className="dashboard__overview">
        {/* Tarjeta de Clientes */}
        <div className="card">
          <p>Clientes</p>
          <h2>{totalClientes}</h2>
          <FaUsers className="card__icon" />
        </div>

        {/* Tarjeta de Ventas del Año */}
        <div className="card">
          <p>Ventas del Año</p>
          <h2>${totalVentasAnio.toFixed(2)}</h2>
          <FaDollarSign className="card__icon" />
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="dashboard__charts">
        {/* Gráfico de barras (Más vendidos) */}
        <div className="chart">
          <Bar data={barDataMasVendidos} options={barOptionsMasVendidos} />
        </div>

        {/* Gráfico de barras (Menos vendidos) */}
        <div className="chart">
          <Bar data={barDataMenosVendidos} options={barOptionsMenosVendidos} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
