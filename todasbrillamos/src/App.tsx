import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AccountSettings from './pages/AccountSettings';
<<<<<<< HEAD
// import Dashboard from "./pages/Dashboard";
// import Productos from "./pages/Productos";
=======
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Products";
import AnadirProductos from "./pages/AddProductPage";
>>>>>>> 69a2f83ecf749daf72b0471f48d43f4e5df3daf2
// import Cuentas from "./pages/Cuentas";
// import Soporte from "./pages/Soporte";


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
        <Route path="/ajustes" element={<AccountSettings />} />
<<<<<<< HEAD
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/cuentas" element={<Cuentas />} />
=======
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/añadirproductos" element={<AnadirProductos />} />
          {/* <Route path="/cuentas" element={<Cuentas />} />
>>>>>>> 69a2f83ecf749daf72b0471f48d43f4e5df3daf2
          <Route path="/soporte" element={<Soporte />} /> */}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
