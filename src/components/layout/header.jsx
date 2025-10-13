// src/components/layout/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, isManager, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-blue-600">Holidaze</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Venues
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Profile
                </Link>
                
                {isManager && (
                  <Link 
                    to="/manage-venues" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    My Venues
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Avatar & Name */}
                <Link 
                  to="/profile"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  {user?.avatar?.url ? (
                    <img 
                      src={user.avatar.url} 
                      alt={user.avatar.alt || user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:block font-medium text-gray-700">
                    {user?.name}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;