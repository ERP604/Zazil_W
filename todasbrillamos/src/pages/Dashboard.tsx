import React from 'react';
import { FaUsers, FaChartLine, FaArrowDown } from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import '../styles/dashboard.css';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard: React.FC = () => {
  // Datos de ejemplo para las gráficas (Fornt End)
  const barData = {
    labels: ['Technology', 'Car Brands', 'Airlines', 'Energy'],
    datasets: [
      {
        label: '2022',
        backgroundColor: '#e57373',
        data: [65, 59, 80, 81],
      },
      {
        label: '2023',
        backgroundColor: '#64b5f6',
        data: [48, 48, 70, 79],
      },
      {
        label: '2024',
        backgroundColor: '#81c784',
        data: [58, 58, 91, 86],
      },
    ],
  };

  const lineData = {
    labels: ['Technology', 'Car Brands', 'Airlines', 'Energy'],
    datasets: [
      {
        label: '2022',
        borderColor: '#e57373',
        fill: true,
        data: [65, 59, 80, 81],
      },
      {
        label: '2023',
        borderColor: '#64b5f6',
        fill: true,
        data: [48, 48, 70, 79],
      },
      {
        label: '2024',
        borderColor: '#81c784',
        fill: true,
        data: [58, 58, 91, 86],
      },
    ],
  };

  // Función que simula una llamada al backend para obtener datos
  // const Dashboard: React.FC = () => {
  //   const [dataClientes, setDataClientes] = useState<number>(0);
  //   const [dataVentas, setDataVentas] = useState<number>(0);
  //   const [dataGastos, setDataGastos] = useState<number>(0);
  //   const [barData, setBarData] = useState<any>(null);
  //   const [lineData, setLineData] = useState<any>(null);
  
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get('https://api.tu-servidor.com/dashboard'); Ejemplo de API
  //         const data = response.data;
  
  //         setDataClientes(data.clientes);
  //         setDataVentas(data.ventasAnuales);
  //         setDataGastos(data.gastos);
  
  //         setBarData({
  //           labels: ['Technology', 'Car Brands', 'Airlines', 'Energy'],
  //           datasets: [
  //             {
  //               label: '2022',
  //               backgroundColor: '#e57373',
  //               data: data.masVendidos2022,
  //             },
  //             {
  //               label: '2023',
  //               backgroundColor: '#64b5f6',
  //               data: data.masVendidos2023,
  //             },
  //             {
  //               label: '2024',
  //               backgroundColor: '#81c784',
  //               data: data.masVendidos2024,
  //             },
  //           ],
  //         });
  
  //         setLineData({
  //           labels: ['Technology', 'Car Brands', 'Airlines', 'Energy'],
  //           datasets: [
  //             {
  //               label: '2022',
  //               borderColor: '#e57373',
  //               fill: true,
  //               data: data.visitas2022,
  //             },
  //             {
  //               label: '2023',
  //               borderColor: '#64b5f6',
  //               fill: true,
  //               data: data.visitas2023,
  //             },
  //             {
  //               label: '2024',
  //               borderColor: '#81c784',
  //               fill: true,
  //               data: data.visitas2024,
  //             },
  //           ],
  //         });
  //       } catch (error) {
  //         console.error('Error fetching data', error);
  //       }
  //     };
  
  //     fetchData();
  //   }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>

      <div className="dashboard__overview">
        <div className="card">
          <p>Clientes</p>
          <h2>500</h2>
          <FaUsers className="card__icon" />
        </div>

        <div className="card">
          <p>Ventas del año</p>
          <h2>$13500.89</h2>
          <FaChartLine className="card__icon" />
        </div>

        <div className="card">
          <p>Gastos</p>
          <h2>-$5500.70</h2>
          <FaArrowDown className="card__icon" />
        </div>
      </div>

      <div className="dashboard__charts">
        <div className="chart">
          <h3>Más vendidos</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h3>Menos vendidos</h3>
          <Line data={lineData} options={{ responsive: true }} />
        </div>

        <div className="chart">
          <h3>Visitas de la semana</h3>
          <Line data={lineData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
