import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AccountSettings from './pages/AccountSettings';
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Products";
import AnadirProductos from "./pages/AddProductPage";
import Cuentas from "./pages/AccountsPage";
import EditarProducto from "./pages/EditarProducto";
import AnadirAdministrador from "./pages/AddAdministrador";

interface AppProps {
  onLogout: () => void; // Propiedad para manejar el cierre de sesión
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  return (
    <Router>
      {/* El layout principal de la aplicación que incluye la navegación y otras funcionalidades */}
      <MainLayout onLogout={onLogout}> 
        <Routes>
          {/* Redirecciona a "/dashboard" si el usuario accede a la ruta raíz */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas para las diferentes páginas de la aplicación */}
          <Route path="/ajustes" element={<AccountSettings />} /> {/* Página de ajustes de cuenta */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Página del dashboard */}
          <Route path="/productos" element={<Productos />} /> {/* Página de productos */}
          <Route path="/addproductos" element={<AnadirProductos />} /> {/* Página para añadir productos */}
          <Route path="/cuentas" element={<Cuentas />} /> {/* Página de cuentas de usuario */}
          <Route path="/editarproductos/:id" element={<EditarProducto />} /> {/* Página para editar productos */}
          <Route path="/anadiradministrador" element={<AnadirAdministrador />} /> {/* Página para añadir administrador */}
          
          {/* Redirecciona a "/dashboard" si la ruta no coincide */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
