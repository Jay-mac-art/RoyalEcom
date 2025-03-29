import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  // State for form inputs and feedback message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle form submission and API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BE_API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      // Save token, userId, and role to local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('role', data.role);

      setMessage('Login successful');
      navigate('/home');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setMessage(
          `Login failed: ${error.response?.data?.message || error.message}`
        );
      } else {
        setMessage(`Login failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in"
      >
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          Login
        </h2>
        <div className="mb-6">
          <label htmlFor="email" className="block text-white mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-600 focus:outline-none"
            required
          />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="block text-white mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-600 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition-colors"
        >
          Login
        </button>
        {message && (
          <p className="mt-4 text-center text-white">{message}</p>
        )}
        <p className="mt-6 text-center text-white">
          Don’t have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};