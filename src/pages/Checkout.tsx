import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const [discountCode, setDiscountCode] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    total: number;
    generatedDiscountCode: string | null;
    items: typeof cart;
  } | null>(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    console.log('Cart in Checkout:', cart);
  }, [cart]);

  const handleCheckout = async () => {
    const isNthOrder = Math.random() < 0.2;
    let generatedDiscountCode = null;
    if (isNthOrder) {
      generatedDiscountCode = `DISCOUNT-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`;
    }
    setOrderConfirmation({
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      total,
      generatedDiscountCode,
      items: [...cart],
    });
    clearCart();
  };

  if (orderConfirmation) {
    return (
      <div className="pt-20 pb-12">
        <h1 className="text-4xl font-bold text-center my-8 text-white animate-fade-in">
          Order Confirmation
        </h1>
        <div className="text-center text-white max-w-md mx-auto bg-gray-900/80 p-6 rounded-lg shadow-xl">
          <p className="text-lg">Thank you for your order!</p>
          <p className="mt-2">Order ID: {orderConfirmation.orderId}</p>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Ordered Items</h3>
            {orderConfirmation.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="text-left">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">x {item.quantity}</p>
                  </div>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          {/* ... rest of the order confirmation component */}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <h1 className="text-4xl font-bold text-center my-8 text-white animate-fade-in">
        Checkout
      </h1>
      <div className="px-4 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-white">Order Summary</h2>
        <div className="bg-gray-900/80 p-4 rounded-lg shadow-md">
          {cart.length === 0 ? (
            <p className="text-white">No items in cart.</p>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="text-white">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">x {item.quantity}</p>
                  </div>
                </div>
                <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
               <div className="mt-6">
            <label htmlFor="discount" className="block mb-2 text-white">
              Discount Code
            </label>
            <input
              type="text"
              id="discount"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter code (if any)"
            />
          </div>
          <div className="mt-8">
            <p className="text-xl font-bold text-white">Total: ${total.toFixed(2)}</p>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="mt-4 w-full bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300 hover:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Place Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};