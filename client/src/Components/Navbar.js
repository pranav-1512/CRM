import React from 'react';
import MyImage from '../Images/Logo.png'; // Import your image path

const Navbar = () => {
  return (
    <div>
      <nav className="navbar flex items-center justify-between bg-gray-100 p-4">
        <a href="/" className="flex items-center">
          <img
            src={MyImage}
            className="overflow-hidden transition-all w-40"
            alt="Logo"
          />
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
