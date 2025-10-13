// src/components/profile/AvatarUpdate.jsx

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateAvatar, validateAvatarUrl } from '../../api/profile/updateAvatar';

const AvatarUpdate = ({ onUpdate }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || '');
  const [avatarAlt, setAvatarAlt] = useState(user?.avatar?.alt || '');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    // Validate URL
    const validation = validateAvatarUrl(avatarUrl);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateAvatar(user.name, {
        url: avatarUrl,
        alt: avatarAlt || user.name,
      });

      if (result.success) {
        // Update auth context
        updateUser({ avatar: result.data.avatar });
        setSuccess(true);
        setIsEditing(false);
        
        // Call parent callback if provided
        if (onUpdate) {
          onUpdate(result.data);
        }

        setTimeout(() => setSuccess(false), 3000);
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarUrl(user?.avatar?.url || '');
    setAvatarAlt(user?.avatar?.alt || '');
    setErrors({});
    setApiError('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Picture</h2>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          Avatar updated successfully!
        </div>
      )}

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {apiError}
        </div>
      )}

      {/* Current Avatar */}
      <div className="flex items-center mb-6">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="ml-6">
          <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          {user?.venueManager && (
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Venue Manager
            </span>
          )}
        </div>
      </div>

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Update Avatar
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => {
                setAvatarUrl(e.target.value);
                if (errors.url) setErrors({});
              }}
              placeholder="https://example.com/avatar.jpg"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.url ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url}</p>
            )}
          </div>

          <div>
            <label htmlFor="avatarAlt" className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text (Optional)
            </label>
            <input
              type="text"
              id="avatarAlt"
              value={avatarAlt}
              onChange={(e) => setAvatarAlt(e.target.value)}
              placeholder="Description of your avatar"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AvatarUpdate;