// src/pages/ManageVenues.jsx

import { useState, useEffect, useCallback  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileVenues } from '../api/profile/getProfile';
import { deleteVenue } from '../api/venues/deleteVenue';
import VenueForm from '../components/venues/VenueForm';
import Loading from '../components/common/Loading';
import Layout from '../components/layout/layout';

const ManageVenues = () => {
  const { user, isAuthenticated, isManager } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchVenues = useCallback(async () => {
    if (!user?.name) return;

    setLoading(true);
    setError('');

    const result = await getProfileVenues(user.name);

    if (result.success) {
      setVenues(result.data || []);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [user?.name]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isManager) {
      navigate('/');
      return;
    }

    fetchVenues();
  }, [isAuthenticated, isManager, navigate, fetchVenues]);

  const handleCreateSuccess = (newVenue) => {
    setVenues(prev => [newVenue, ...prev]);
    setShowCreateForm(false);
  };

  const handleEditSuccess = (updatedVenue) => {
    setVenues(prev => prev.map(v => v.id === updatedVenue.id ? updatedVenue : v));
    setEditingVenue(null);
  };

  const handleDelete = async (venueId) => {
    const result = await deleteVenue(venueId);

    if (result.success) {
      setVenues(prev => prev.filter(v => v.id !== venueId));
      setDeleteConfirm(null);
    } else {
      alert(result.error);
    }
  };

  if (!isAuthenticated || !isManager) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading your venues..." />
      </Layout>
    );
  }

  // Show create form
  if (showCreateForm) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to my venues
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Create New Venue</h1>
          </div>
          <VenueForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      </Layout>
    );
  }

  // Show edit form
  if (editingVenue) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setEditingVenue(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to my venues
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Edit Venue</h1>
          </div>
          <VenueForm
            venue={editingVenue}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingVenue(null)}
          />
        </div>
      </Layout>
    );
  }

  // Main venue list view
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Venues</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Create Venue
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {venues.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No venues yet</h3>
            <p className="text-gray-600 mb-6">Create your first venue to start hosting guests!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Venue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={venue.media?.[0]?.url || 'https://placehold.co/400x300?text=No+Image'}
                    alt={venue.media?.[0]?.alt || venue.name}
                    className="w-full h-full object-cover"
                  />
                  {venue._count?.bookings > 0 && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {venue._count.bookings} booking{venue._count.bookings !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {venue.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {venue.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">${venue.price}/night</span>
                    <span className="text-sm text-gray-600">Up to {venue.maxGuests} guests</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/venues/${venue.id}`}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setEditingVenue(venue)}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(venue.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Venue?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this venue? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageVenues;