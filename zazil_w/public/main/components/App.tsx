import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Productos from './Productos';
import Dashboard from './Dashboard';
import GestionCuentas from './GestionCuentas';
import '../css/App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <div className="main-layout">
                    <Sidebar />
                    <div className="content">
                        <Routes>
                            <Route path="/productos" element={<Productos />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/gestion-cuentas" element={<GestionCuentas />} />
                            {/* Agrega más rutas según sea necesario */}
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
