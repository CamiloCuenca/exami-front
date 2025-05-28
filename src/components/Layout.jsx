import React from 'react';
import Navbar from './navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-20">
                {children}
            </main>
        </div>
    );
};

export default Layout; 