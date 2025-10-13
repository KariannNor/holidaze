// src/components/venues/VenueForm.jsx

import { useState, useEffect } from 'react';
import { createVenue, validateVenue } from '../../api/venues/createVenue';
import { updateVenue } from '../../api/venues/updateVenue';

const VenueForm = ({ venue = null, onSuccess, onCancel }) => {
  const isEditing = !!venue;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    media: [{ url: '', alt: '' }],
    price: 0,
    maxGuests: 1,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        media: venue.media?.length > 0 ? venue.media : [{ url: '', alt: '' }],
        price: venue.price || 0,
        maxGuests: venue.maxGuests || 1,
        rating: venue.rating || 0,
        meta: {
          wifi: venue.meta?.wifi || false,
          parking: venue.meta?.parking || false,
          breakfast: venue.meta?.breakfast || false,
          pets: venue.meta?.pets || false,
        },
        location: {
          address: venue.location?.address || '',
          city: venue.location?.city || '',
          zip: venue.location?.zip || '',
          country: venue.location?.country || '',
          continent: venue.location?.continent || '',
        },
      });
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('meta.')) {
      const metaKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        meta: { ...prev.meta, [metaKey]: checked },
      }));
    } else if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationKey]: value },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleMediaChange = (index, field, value) => {
    const newMedia = [...formData.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const addMediaField = () => {
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, { url: '', alt: '' }],
    }));
  };

  const removeMediaField = (index) => {
    const newMedia = formData.media.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      media: newMedia.length > 0 ? newMedia : [{ url: '', alt: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Clean up media - remove empty entries
    const cleanedMedia = formData.media.filter(m => m.url.trim() !== '');

    const venueData = {
      ...formData,
      media: cleanedMedia.length > 0 ? cleanedMedia : [],
    };

    const validation = validateVenue(venueData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = isEditing
        ? await updateVenue(venue.id, venueData)
        : await createVenue(venueData);

      if (result.success) {
        if (onSuccess) onSuccess(result.data);
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {apiError}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Beautiful Beach House"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe your venue..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
                Max Guests *
              </label>
              <input
                type="number"
                id="maxGuests"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxGuests ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.maxGuests && <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Images</h3>
        <div className="space-y-4">
          {formData.media.map((mediaItem, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="url"
                  value={mediaItem.url}
                  onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={mediaItem.alt}
                  onChange={(e) => handleMediaChange(index, 'alt', e.target.value)}
                  placeholder="Image description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {formData.media.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMediaField(index)}
                  className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMediaField}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            + Add Image
          </button>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(formData.meta).map(key => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={`meta.${key}`}
                checked={formData.meta[key]}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="location.zip" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              name="location.zip"
              value={formData.location.zip}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="location.country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Venue' : 'Create Venue'}
        </button>
      </div>
    </form>
  );
};

export default VenueForm;