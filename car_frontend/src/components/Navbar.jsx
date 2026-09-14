import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <Car size={28} strokeWidth={2.5} />
          <span>Veloce<span style={{ color: '#06b6d4' }}>Cars</span></span>
        </NavLink>
        <nav className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end
          >
            Catalog
          </NavLink>
          <NavLink 
            to="/add-car" 
            className="btn-add-nav"
          >
            List a Car
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
