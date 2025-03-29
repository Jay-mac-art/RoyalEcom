import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const [applicableCoupon, setApplicableCoupon] = useState<{ code: string; discountPercentage: number } | null>(null);
  const [enteredCouponCode, setEnteredCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    total: number;
    discountAmount: number;
    items: typeof cart;
  } | null>(null);
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? subtotal * (appliedDiscount / 100) : 0;
  const total = subtotal - discountAmount;

  // Fetch applicable coupon when component mounts
  useEffect(() => {
    const fetchApplicableCoupon = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await fetch(`${import.meta.env.VITE_BE_API_URL}/check-coupon`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch coupon');
        }
        const data = await response.json();
        if (data.applicable) {
          setApplicableCoupon({
            code: data.coupon.code,
            discountPercentage: parseFloat(data.coupon.discountPercentage),
          });
        } else {
          setApplicableCoupon(null);
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
      }
    };
    fetchApplicableCoupon();
  }, []);

  // Handle applying the coupon
  const handleApplyCoupon = () => {
    if (applicableCoupon && enteredCouponCode === applicableCoupon.code) {
      setAppliedDiscount(applicableCoupon.discountPercentage);
    } else {
      setAppliedDiscount(0);
      alert('Invalid coupon code');
    }
  };

  // Handle placing the order
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to place order');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
          })),
          ...(enteredCouponCode && { couponCode: enteredCouponCode }), // Include couponCode only if entered
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderConfirmation({
          orderId: data.orderId,
          total: data.total_amount,
          discountAmount: data.discount_amount,
          items: [...cart],
        });
        clearCart();
      } else {
        alert('Order failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  // Order Confirmation UI
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
          {orderConfirmation.discountAmount > 0 && (
            <p className="mt-4 text-green-500">
              Discount: -${orderConfirmation.discountAmount.toFixed(2)}
            </p>
          )}
          <p className="mt-2 text-xl font-bold">
            Total: ${orderConfirmation.total.toFixed(2)}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300"
          >
            Shop More
          </button>
        </div>
      </div>
    );
  }

  // Checkout UI
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
            {applicableCoupon && (
              <p className="text-green-500 mb-2">
                You have a coupon available: {applicableCoupon.code}
              </p>
            )}
            <label htmlFor="discount" className="block mb-2 text-white">
              Discount Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="discount"
                value={enteredCouponCode}
                onChange={(e) => setEnteredCouponCode(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter code (if any)"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            <p className="text-white">Subtotal: ${subtotal.toFixed(2)}</p>
            {appliedDiscount > 0 && (
              <p className="text-green-500">
                Discount ({appliedDiscount}%): -${discountAmount.toFixed(2)}
              </p>
            )}
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