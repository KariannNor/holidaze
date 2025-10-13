// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Holidaze</h2>
            <p className="text-gray-600">
              Your trusted platform for discovering and booking amazing accommodations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Become a Host
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Help Center</li>
              <li className="text-gray-600">Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {currentYear} Holidaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;