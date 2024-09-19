import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AccountSettings from './pages/AccountSettings';
// import Dashboard from "./pages/Dashboard";
// import Productos from "./pages/Productos";
// import Cuentas from "./pages/Cuentas";
// import Soporte from "./pages/Soporte";



const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
        <Route path="/ajustes" element={<AccountSettings />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/soporte" element={<Soporte />} /> */}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
