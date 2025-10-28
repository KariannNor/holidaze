// src/pages/VenueDetailsPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenueById } from '../api/venues/getVenueById';
import BookingForm from '../components/bookings/BookingForm';
import Loading from '../components/common/Loading';
import Layout from '../components/layout/layout';

const VenueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      setError('');

      const result = await getVenueById(id, {
        includeOwner: true,
        includeBookings: true,
      });

      if (result.success) {
        setVenue(result.data);
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading venue..." />
      </Layout>
    );
  }

  if (error || !venue) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Venue not found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to venues
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = venue.media && venue.media.length > 0 
    ? venue.media 
    : [{ url: 'https://placehold.co/800x600?text=No+Image', alt: venue.name }];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span> Back to venues
        </button>

        {/* Venue Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{venue.name}</h1>
          <div className="flex items-center text-gray-600">
            {venue.rating > 0 && (
              <div className="flex items-center mr-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-semibold">{venue.rating.toFixed(1)}</span>
              </div>
            )}
            {venue.location?.city && (
              <span>
                {venue.location.city}
                {venue.location.country && `, ${venue.location.country}`}
              </span>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {/* Main Image */}
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt || venue.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-blue-600 scale-95'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `${venue.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this venue</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">👥</span>
                  <span>Up to {venue.maxGuests} guests</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {venue.description && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{venue.description}</p>
              </div>
            )}

            {/* Amenities */}
            {venue.meta && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {venue.meta.wifi && (
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">📶</span> WiFi
                    </div>
                  )}
                  {venue.meta.parking && (
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">🅿️</span> Parking
                    </div>
                  )}
                  {venue.meta.breakfast && (
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">🍳</span> Breakfast
                    </div>
                  )}
                  {venue.meta.pets && (
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">🐾</span> Pets allowed
                    </div>
                  )}
                </div>
                {!venue.meta.wifi && !venue.meta.parking && !venue.meta.breakfast && !venue.meta.pets && (
                  <p className="text-gray-500">No amenities listed</p>
                )}
              </div>
            )}

            {/* Location */}
            {venue.location && (venue.location.address || venue.location.city || venue.location.country) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="space-y-2 text-gray-700">
                  {venue.location.address && <p>{venue.location.address}</p>}
                  {venue.location.city && (
                    <p>
                      {venue.location.city}
                      {venue.location.zip && `, ${venue.location.zip}`}
                    </p>
                  )}
                  {venue.location.country && <p>{venue.location.country}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm venue={venue} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VenueDetailsPage;