import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingCart } from 'lucide-react';

// Set the app element for accessibility
Modal.setAppElement('#root');

// Assume Product type and cart state management are defined elsewhere
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Simulated cart addition (replace with your actual cart logic)
  const addToCart = (product: Product) => {
    console.log(`${product.name} added to cart`);
    // Add your cart state logic here (e.g., using Zustand or Context)
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsModalOpen(false);
    toast.success(
      <div>
        {product.name} added to cart!
        <button
          onClick={() => navigate('/cart')}
          className="ml-4 bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-600"
        >
          View Cart
        </button>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000, // Disappears after 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-900/80 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        <p className="text-gray-400 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-purple-400">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={openModal}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-600 transition-all duration-300 hover:shadow-lg"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Confirmation Popup */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-md mx-auto mt-20 text-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Confirm Add to Cart</h2>
        <p className="mb-6">Do you want to add {product.name} to your cart?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              handleAddToCart();
              navigate('/checkout');
            }}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Go to Checkout
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition-colors"
          >
            Add and Continue
          </button>
        </div>
      </Modal>
    </div>
  );
};