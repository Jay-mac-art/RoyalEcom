import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

const products: Product[] = [
  {
    id: '1',
    name: 'Aurora Watch',
    description: 'A sleek timepiece inspired by the Northern Lights.',
    price: 199.99,
    image: 'https://via.placeholder.com/300',
  },
  {
    id: '2',
    name: 'Polar Jacket',
    description: 'Warmth and style for any adventure.',
    price: 129.99,
    image: 'https://via.placeholder.com/300',
  },
  {
    id: '3',
    name: 'Midnight Lamp',
    description: 'Illuminate your space with elegance.',
    price: 59.99,
    image: 'https://via.placeholder.com/300',
  },
];

export const Home = () => {
  return (
    <div className="pt-20 pb-12">
      <h1 className="text-4xl font-bold text-center my-8 text-white animate-fade-in">
        Featured Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};