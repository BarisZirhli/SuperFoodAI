import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    marketing: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
          <Input
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              name="marketing"
              checked={formData.marketing}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label className="ml-2 block text-sm text-gray-600">
              I do not want to receive emails with advertising, news, suggestions or marketing promotions
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            Sign up
          </Button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          By signing up to create an account, you are accepting our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;