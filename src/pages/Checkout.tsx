import React, { useState } from 'react';
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
  } | null>(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    // Simulate POST /api/checkout
    const isNthOrder = Math.random() < 0.2; // 20% chance to simulate nth order
    let generatedDiscountCode = null;
    if (isNthOrder) {
      generatedDiscountCode = `DISCOUNT-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`;
    }
    // TODO: In production, validate discountCode with server
    setOrderConfirmation({
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      total,
      generatedDiscountCode,
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
          <p className="mt-2">Total: ${orderConfirmation.total.toFixed(2)}</p>
          {orderConfirmation.generatedDiscountCode && (
            <p className="mt-4 text-purple-400">
              Congratulations! Use this 10% discount code on your next purchase:{' '}
              <span className="font-bold">
                {orderConfirmation.generatedDiscountCode}
              </span>
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300 hover:shadow-lg"
          >
            Continue Shopping
          </button>
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
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between mb-2 text-white"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
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
            <p className="text-xl font-bold text-white">
              Total: ${total.toFixed(2)}
            </p>
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