import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Sign up</h1>
        <p className="text-gray-600 mb-6">
          Create an account or{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-700">
            Sign in
          </Link>
        </p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-8 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label className="ml-2 block text-sm text-gray-600">
              I do not want to receive emails with advertising, news, suggestions or marketing promotions
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            Sign up
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          By signing up to create an account, you are accepting our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;