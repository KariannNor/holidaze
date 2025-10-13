import { Link } from 'react-router-dom';

const VenueCard = ({ venue }) => {
  const image = venue.media?.[0]?.url || 'https://placehold.co/400x300?text=No+Image';
  const imageAlt = venue.media?.[0]?.alt || venue.name;

  return (
    <Link 
      to={`/venues/${venue.id}`}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow block"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {venue.name}
        </h3>
        
        {venue.location?.city && (
          <p className="text-gray-600 text-sm mb-3">
            {venue.location.city}
            {venue.location.country && `, ${venue.location.country}`}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-900">${venue.price}</span>
            <span className="text-gray-600 text-sm ml-1">/ night</span>
          </div>

          {venue.rating > 0 && (
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm mr-1">★</span>
              <span className="text-sm font-semibold">{venue.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-600">
          Up to {venue.maxGuests} guests
        </div>

        {/* Amenities */}
        {venue.meta && (
          <div className="flex items-center mt-3 space-x-3 text-xs text-gray-600">
            {venue.meta.wifi && <span>📶 WiFi</span>}
            {venue.meta.parking && <span>🅿️ Parking</span>}
            {venue.meta.breakfast && <span>🍳 Breakfast</span>}
            {venue.meta.pets && <span>🐾 Pets</span>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default VenueCard;