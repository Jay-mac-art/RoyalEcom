import React from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="pt-20 pb-12">
      <h1 className="text-4xl font-bold text-center my-8 text-white animate-fade-in">
        Your Cart
      </h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          Your cart is empty.{' '}
          <Link to="/" className="text-purple-400 hover:underline">
            Start Shopping
          </Link>
        </p>
      ) : (
        <div className="px-4 max-w-2xl mx-auto">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center mb-6 bg-gray-900/80 p-4 rounded-lg shadow-md hover:shadow-purple-500/50 transition-shadow duration-300"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, parseInt(e.target.value) || 1)
                  }
                  className="w-16 p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-white">
              Total: ${total.toFixed(2)}
            </p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300 hover:shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};