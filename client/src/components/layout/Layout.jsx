import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-emerald-500">
      <Header />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;