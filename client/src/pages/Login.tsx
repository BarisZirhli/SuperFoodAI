import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">LOGIN</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors"
          >
            Enter
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have account?{' '}
          <Link to="/signup" className="text-emerald-500 hover:text-emerald-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;