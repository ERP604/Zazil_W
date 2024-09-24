import React, { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/mainLayout.css";

interface MainLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className="main-layout">
      {/* Pasamos la prop onLogout al Sidebar */}
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
