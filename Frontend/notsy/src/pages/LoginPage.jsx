import React from 'react';
import Login from '../components/Login';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* You can add your logo here */}
          <h1 className="text-3xl font-bold text-blue-600">Notsy</h1>
        </div>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;