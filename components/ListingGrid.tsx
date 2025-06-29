import React from 'react';
import { Listing } from '../types';

interface ListingGridProps {
  listings?: Listing[];
  onListingClick?: (listing: Listing) => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings = [], onListingClick }) => {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No listings found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onListingClick?.(listing)}
        >
          <img
            src={listing.imageUrl}
            alt={listing.address}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {listing.address}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                listing.leadType === 'Expired' ? 'bg-red-100 text-red-800' :
                listing.leadType === 'FSBO' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {listing.leadType}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              {listing.city}, {listing.state} {listing.zip}
            </p>
            <p className="text-2xl font-bold text-green-600 mb-2">
              ${listing.price.toLocaleString()}
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{listing.bedrooms} bed</span>
              <span>{listing.bathrooms} bath</span>
              <span>{listing.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;