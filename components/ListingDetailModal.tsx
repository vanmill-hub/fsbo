import React from 'react';
import { Listing } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (listing: Listing) => void;
  onDelete?: (listingId: string) => void;
}

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !listing) return null;

  const getLeadTypeBadgeColor = (leadType: string) => {
    switch (leadType) {
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'FSBO':
        return 'bg-blue-100 text-blue-800';
      case 'Pre-foreclosure':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Listing Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image */}
            <div>
              <img
                src={listing.imageUrl}
                alt={listing.address}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getLeadTypeBadgeColor(
                    listing.leadType
                  )}`}
                >
                  {listing.leadType}
                </span>
                {listing.isFavorite && (
                  <span className="text-yellow-500">⭐</span>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2">{listing.address}</h3>
              <p className="text-gray-600 mb-4">
                {listing.city}, {listing.state} {listing.zip}
              </p>

              <div className="text-3xl font-bold text-green-600 mb-4">
                ${listing.price.toLocaleString()}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{listing.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{listing.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{listing.sqft.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Property Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span>{listing.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span>{listing.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span>{listing.lotSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days on Market:</span>
                  <span>{listing.daysOnMarketPreviously}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Listing Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original List Date:</span>
                  <span>{new Date(listing.originalListDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiration Date:</span>
                  <span>{new Date(listing.expirationDate).toLocaleDateString()}</span>
                </div>
                {listing.previousAgentName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous Agent:</span>
                    <span>{listing.previousAgentName}</span>
                  </div>
                )}
                {listing.previousAgentBrokerage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Previous Brokerage:</span>
                    <span>{listing.previousAgentBrokerage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.listingDescription && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Description</h4>
              <p className="text-gray-700 leading-relaxed">{listing.listingDescription}</p>
            </div>
          )}

          {/* AI Insights */}
          {(listing.aiLeadScore || listing.aiEstimatedValue) && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">AI Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.aiLeadScore && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Lead Score</div>
                    <div className="text-lg font-semibold">{listing.aiLeadScore}</div>
                    {listing.aiLeadScoreReason && (
                      <div className="text-sm text-gray-600 mt-1">{listing.aiLeadScoreReason}</div>
                    )}
                  </div>
                )}
                {listing.aiEstimatedValue && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">AI Estimated Value</div>
                    <div className="text-lg font-semibold">${listing.aiEstimatedValue.toLocaleString()}</div>
                    {listing.aiValuationReasoning && (
                      <div className="text-sm text-gray-600 mt-1">{listing.aiValuationReasoning}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(listing.homeownerEmail || listing.homeownerPhone) && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
              <div className="space-y-2">
                {listing.homeownerEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{listing.homeownerEmail}</span>
                  </div>
                )}
                {listing.homeownerPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{listing.homeownerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {listing.notes && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Notes</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{listing.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          {onDelete && (
            <button
              onClick={() => onDelete(listing.id)}
              className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(listing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;