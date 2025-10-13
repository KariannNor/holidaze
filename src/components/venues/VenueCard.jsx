// src/components/venues/VenueCard.jsx

import { Link } from 'react-router-dom';

const VenueCard = ({ venue }) => {
  const { id, name, media, price, maxGuests, rating, location } = venue;
  
  // Get first image or use placeholder
  const imageUrl = media?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';
  const imageAlt = media?.[0]?.alt || name;

  return (
    <Link 
      to={`/venues/${id}`}
      className="group block bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        {location?.city && (
          <p className="text-sm text-gray-500 mb-1">
            {location.city}{location.country && `, ${location.country}`}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Details */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Up to {maxGuests} guest{maxGuests !== 1 ? 's' : ''}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">${price}</span>
            <span className="text-sm text-gray-600"> / night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;