import React from 'react';
import '../css/Header.css';

interface HeaderProps {
  showLogo: boolean;
}

const Header: React.FC<HeaderProps> = ({ showLogo }) => {
  return (
    <header className="header">
      {showLogo && <img src="public\assets\TodasBrillamos.png" alt="Logo" className="logo" />}
      {/* Otros elementos del header si los hay */}
    </header>
  );
};

export default Header;
