import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const location = window.location;

    return (
        <div className="flex items-center justify-between">
            <Link
                to="/banco-preguntas"
                className={`flex items-center px-4 py-2 text-sm ${
                    location.pathname === '/banco-preguntas'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                Banco de Preguntas
            </Link>
        </div>
    );
};

export default Navbar; 