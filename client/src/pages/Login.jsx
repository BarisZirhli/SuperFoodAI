import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">LOGIN</h1>
        <form className="space-y-6">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
          >
            Enter
          </Button>
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