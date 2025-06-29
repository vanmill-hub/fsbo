import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Expired & FSBO Listings Pro
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;