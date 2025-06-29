import React from 'react';

const FilterControls: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Listings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">All Types</option>
            <option value="Single Family">Single Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">All Types</option>
            <option value="Expired">Expired</option>
            <option value="FSBO">FSBO</option>
            <option value="Pre-foreclosure">Pre-foreclosure</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Any Price</option>
            <option value="0-200000">Under $200k</option>
            <option value="200000-500000">$200k - $500k</option>
            <option value="500000+">$500k+</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;