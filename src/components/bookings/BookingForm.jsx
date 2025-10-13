// src/components/bookings/BookingForm.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createBooking, validateBooking } from '../../api/bookings/createBooking';

const BookingForm = ({ venue }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const calculateNights = () => {
    if (formData.dateFrom && formData.dateTo) {
      const from = new Date(formData.dateFrom);
      const to = new Date(formData.dateTo);
      const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * venue.price;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/venues/${venue.id}` } });
      return;
    }

    const bookingData = {
      venueId: venue.id,
      dateFrom: new Date(formData.dateFrom).toISOString(),
      dateTo: new Date(formData.dateTo).toISOString(),
      guests: formData.guests,
    };

    const validation = validateBooking(bookingData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (formData.guests > venue.maxGuests) {
      setErrors({ guests: `Maximum ${venue.maxGuests} guests allowed` });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createBooking(bookingData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">${venue.price}</span>
          <span className="text-gray-600 ml-2">/ night</span>
        </div>
        {venue.rating > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-semibold">{venue.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          Booking successful! Redirecting to your profile...
        </div>
      )}

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateFrom ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dateFrom && (
            <p className="mt-1 text-sm text-red-600">{errors.dateFrom}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            min={formData.dateFrom || new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateTo ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.dateTo && (
            <p className="mt-1 text-sm text-red-600">{errors.dateTo}</p>
          )}
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
            Guests
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max={venue.maxGuests}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.guests ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.guests && (
            <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Maximum {venue.maxGuests} guests
          </p>
        </div>

        {nights > 0 && (
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>${venue.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
              <span>${venue.price * nights}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Booking...' : isAuthenticated ? 'Reserve' : 'Log in to book'}
        </button>
      </form>

      {!isAuthenticated && (
        <p className="text-center text-sm text-gray-600 mt-4">
          You need to be logged in to make a booking
        </p>
      )}
    </div>
  );
};

export default BookingForm;