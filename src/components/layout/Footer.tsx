import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DoorServe</h3>
            <p className="text-gray-300">
              Your trusted platform for booking home services. Professional, reliable services delivered to your doorstep.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white">Categories</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white">How it Works</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><Link to="/my-bookings" className="text-gray-300 hover:text-white">My Bookings</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Partners</h4>
            <ul className="space-y-2">
              <li><Link to="/partner" className="text-gray-300 hover:text-white">Partner Dashboard</Link></li>
              <li><Link to="/partner/register" className="text-gray-300 hover:text-white">Become a Partner</Link></li>
              <li><Link to="/partner/help" className="text-gray-300 hover:text-white">Partner Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} DoorServe. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
