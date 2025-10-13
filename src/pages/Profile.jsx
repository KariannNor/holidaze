import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileBookings } from '../api/profile/getProfile';
import BookingCard from '../components/bookings/BookingCard';
import AvatarUpdate from '../components/profile/AvatarUpdate';
import Loading from '../components/common/Loading';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const { user, isAuthenticated, isManager, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchBookings = useCallback(async () => {
    if (!user?.name) return;

    setLoading(true);
    setError('');

    const result = await getProfileBookings(user.name);

    if (result.success) {
      setBookings(result.data || []);
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

    fetchBookings();
  }, [isAuthenticated, navigate, fetchBookings]);

  // Add effect to refresh user data when page gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (refreshUser) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // Also refresh when component mounts
    if (refreshUser) {
      refreshUser();
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshUser]);

  // Filter bookings by status
  const today = new Date();
  const upcomingBookings = bookings.filter(booking => new Date(booking.dateTo) > today);
  const pastBookings = bookings.filter(booking => new Date(booking.dateTo) <= today);

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          
          <div className="flex items-center space-x-4">
            {/* Refresh Button */}
            <button
              onClick={refreshUser}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🔄 Refresh
            </button>

            {/* Add Venue Button - only show for venue managers */}
            {isManager && (
              <Link
                to="/manage-venues"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <span className="mr-2">🏠</span>
                Manage My Venues
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <AvatarUpdate onUpdate={fetchBookings} />
            
            {/* Venue Manager Card */}
            {isManager && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Venue Manager</h3>
                <p className="text-blue-700 mb-4">
                  You can create and manage venues for guests to book.
                </p>
                <Link
                  to="/manage-venues"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Manage Venues
                </Link>
              </div>
            )}

            {/* Become Host Card - for non-managers */}
            {!isManager && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Become a Host</h3>
                <p className="text-gray-700 mb-4">
                  Want to list your own venues? You'll need to register as a venue manager.
                </p>
                <Link
                  to="/register"
                  className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

              {/* Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    activeTab === 'upcoming'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upcoming ({upcomingBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    activeTab === 'past'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Past ({pastBookings.length})
                </button>
              </div>

              {/* Loading State */}
              {loading && <Loading message="Loading bookings..." />}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                  {error}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && displayedBookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No {activeTab} bookings
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'upcoming' 
                      ? "You don't have any upcoming bookings yet." 
                      : "You don't have any past bookings."}
                  </p>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Browse Venues
                    </button>
                  )}
                </div>
              )}

              {/* Bookings List */}
              {!loading && !error && displayedBookings.length > 0 && (
                <div className="space-y-4">
                  {displayedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;