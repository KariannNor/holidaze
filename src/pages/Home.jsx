// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { getVenues, searchVenues } from '../api/venues/getVenues';
import VenueCard from '../components/venues/VenueCard';
import SearchBar from '../components/common/SearchBar';
import Loading from '../components/common/Loading';
import Layout from '../components/layout/Layout';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all venues on initial load
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    setError('');
    
    const result = await getVenues({ 
      limit: 100,
      sort: 'created',
      includeOwner: false,
    });

    if (result.success) {
      setVenues(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is cleared, fetch all venues again
      fetchVenues();
      return;
    }

    setLoading(true);
    setError('');

    const result = await searchVenues(query);

    if (result.success) {
      setVenues(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find your perfect stay
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing accommodations for your next adventure
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Venues'}
          </h2>
          <p className="text-gray-600 mt-2">
            {venues.length} venue{venues.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Loading State */}
        {loading && <Loading message="Loading venues..." />}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && venues.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 mb-4">No venues found</p>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search and view all venues
              </button>
            )}
          </div>
        )}

        {/* Venues Grid */}
        {!loading && !error && venues.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;