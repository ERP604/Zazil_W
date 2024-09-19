import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AccountSettings from './pages/AccountSettings';
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Products";
import AnadirProductos from "./pages/AddProductPage";
import Cuentas from "./pages/AccountsPage";
import Soporte from "./pages/Support";
import EditarProducto from "./pages/EditarProducto";


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/ajustes" element={<AccountSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/añadirproductos" element={<AnadirProductos />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/editarproductos" element={<EditarProducto />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
