import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const user = localStorage.getItem("user");

    const handleAuthClick = (e) => {
        if (user) {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.reload();
        }
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundImage: 'var(--gradient-header)' }}></div>
            <div className={`flex items-center justify-between px-6 bg-white ${isScrolled ? 'py-3' : 'py-4'} transition-all duration-300`}>
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">E</span>
                    </div>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        EXAMI
                    </span>
                </Link>
                {/* Links Centrados */}
                <nav className="flex-1 flex justify-center">
                    <ul className="flex space-x-8">
                        <li>
                            <Link to="/" className="text-base font-medium hover:text-indigo-600 transition-colors">Inicio</Link>
                        </li>
                        <li>
                            <Link to="/examenes" className="text-base font-medium hover:text-indigo-600 transition-colors">Examenes</Link>
                        </li>
                        <li>
                            <span className="text-base font-medium text-gray-400 cursor-not-allowed">Estadisticas</span>
                        </li>
                    </ul>
                </nav>
                {/* Auth Button */}
                <div className="flex items-center space-x-4">
                    <Link
                        to={user ? "#" : "/login"}
                        className={`btn-primary ${user ? "bg-red-600 hover:bg-red-700 border-red-600" : ""}`}
                        onClick={handleAuthClick}
                    >
                        {user ? "Cerrar sesión" : "Iniciar Sesión"}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;