import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AccountSettings from './pages/AccountSettings';
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Products";
import AnadirProductos from "./pages/AddProductPage";
import Cuentas from "./pages/AccountsPage";
import EditarProducto from "./pages/EditarProducto";
import AnadirAdministrador from "./pages/AddAdministrador";

interface AppProps {
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  return (
    <Router>
      {/* Pasamos onLogout al MainLayout */}
      <MainLayout onLogout={onLogout}>
        <Routes>
          <Route path="/ajustes" element={<AccountSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/añadirproductos" element={<AnadirProductos />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/editarproductos" element={<EditarProducto />} />
          <Route path="/añadiradministrador" element={<AnadirAdministrador />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
