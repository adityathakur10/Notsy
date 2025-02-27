
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="bg-white p-12 rounded-xl shadow-lg w-full min-w-[600px]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
        <p className="text-lg text-gray-600 mt-3">Join Notsy today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-2xl mx-auto">
        <div>
          <label htmlFor="username" className="block text-base font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="appearance-none relative block w-full px-4 py-3 text-lg border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="appearance-none relative block w-full px-4 py-3 text-lg border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="appearance-none relative block w-full px-4 py-3 text-lg border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-base text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
