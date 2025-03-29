import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const cart = useStore((state) => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-950/90 backdrop-blur-md text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/home" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wide hover:text-purple-300 transition-colors">
              Royal Shop
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {role === 'admin' && (
              <Link
                to="/admin"
                className="hover:text-purple-300 transition-colors transform hover:scale-110"
              >
                <LayoutDashboard className="h-6 w-6" />
              </Link>
            )}
            <Link
              to="/cart"
              className="relative hover:text-purple-300 transition-colors transform hover:scale-110"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-purple-300 transition-colors transform hover:scale-110"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};