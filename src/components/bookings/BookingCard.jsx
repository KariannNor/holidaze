// src/components/bookings/BookingCard.jsx

import { Link } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  const { id, dateFrom, dateTo, guests, venue } = booking;

  // Format dates
  const checkIn = new Date(dateFrom);
  const checkOut = new Date(dateTo);
  const today = new Date();
  
  // Calculate nights
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  // Check if booking is upcoming or past
  const isUpcoming = checkOut > today;
  const isPast = checkOut < today;

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get venue image
  const venueImage = venue?.media?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';
  const venueImageAlt = venue?.media?.[0]?.alt || venue?.name || 'Venue';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
          {venue ? (
            <Link to={`/venues/${venue.id}`}>
              <img
                src={venueImage}
                alt={venueImageAlt}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </Link>
          ) : (
            <img
              src={venueImage}
              alt={venueImageAlt}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              {venue ? (
                <Link 
                  to={`/venues/${venue.id}`}
                  className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {venue.name}
                </Link>
              ) : (
                <h3 className="text-xl font-bold text-gray-900">Venue Unavailable</h3>
              )}
              
              {venue?.location?.city && (
                <p className="text-gray-600 mt-1">
                  {venue.location.city}
                  {venue.location.country && `, ${venue.location.country}`}
                </p>
              )}
            </div>

            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isUpcoming 
                ? 'bg-green-100 text-green-800' 
                : isPast 
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isUpcoming ? 'Upcoming' : isPast ? 'Past' : 'Active'}
            </span>
          </div>

          {/* Booking Details */}
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center">
              <span className="font-medium mr-2">📅</span>
              <span>
                {formatDate(checkIn)} - {formatDate(checkOut)}
                <span className="text-gray-500 ml-2">({nights} night{nights !== 1 ? 's' : ''})</span>
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium mr-2">👥</span>
              <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
            </div>

            {venue?.price && (
              <div className="flex items-center">
                <span className="font-medium mr-2">💰</span>
                <span className="font-bold text-gray-900">
                  ${venue.price * nights} total
                </span>
              </div>
            )}
          </div>

          {/* Booking ID */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Booking ID: {id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;