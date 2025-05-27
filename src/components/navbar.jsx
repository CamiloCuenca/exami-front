import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

    // Define el gradiente para el fondo del header y el indicador de scroll
    const headerGradient = "linear-gradient(to right, var(--tw-gradient-stops))";

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Cargar usuario del localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        
        // Limpieza del event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Función para manejar cerrar sesión
    const handleAuthClick = (e) => {
        if (user) {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.reload();
        }
    };

    // Menú desplegable para docente
    const [showDropdown, setShowDropdown] = useState(false);
    const handleDropdown = () => setShowDropdown((prev) => !prev);
    const closeDropdown = () => setShowDropdown(false);

    // Alternar el estado del menú móvil
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg`}
            style={{
                // Remove background image and opacity/blur
            }}
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo o Nombre de la App */}
                <Link to="/" className="flex items-center">
                    {/* Aquí puedes poner tu SVG o un img tag para el logo */}
                    {/* Ejemplo de placeholder SVG de libro */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xl font-bold text-indigo-800 font-heading">Exami</span>
                </Link>

                {/* Botón del menú móvil */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-indigo-800 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>

                {/* Links Centrados - Ocultos en móvil por defecto */}
                <nav className={`md:flex flex-1 justify-center ${isOpen ? 'block absolute top-full left-0 right-0 bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg shadow-lg py-4 md:static md:bg-transparent md:shadow-none md:py-0 font-sans' : 'hidden font-sans'}`}>
                    <ul className={`flex ${isOpen ? 'flex-col items-center space-y-4' : 'space-x-8'} md:flex-row md:space-y-0`}>
                        {user ? (
                            <>
                                <motion.li whileHover={{ scale: 1.05 }}>
                                    <Link 
                                        to={user.tipoUsuario === "Estudiante" ? "/home-estudiante" : "/home-profe"} 
                                        className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                    >
                                        🏠<span className="ml-1">Inicio</span>
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ scale: 1.05 }}>
                                    <Link 
                                        to={user.tipoUsuario === "Estudiante" ? "/examenes-estudiante" : "/examenes-docente"} 
                                        className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                    >
                                        📝<span className="ml-1">Exámenes</span>
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ scale: 1.05 }}>
                                    <Link 
                                        to="/estadisticas" 
                                        className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                    >
                                        📊<span className="ml-1">Estadísticas</span>
                                    </Link>
                                </motion.li>
                            </>
                        ) : (
                            <>
                                <motion.li whileHover={{ scale: 1.05 }}>
                                    <Link 
                                        to="/" 
                                        className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                    >
                                        🏠<span className="ml-1">Inicio</span>
                                    </Link>
                                </motion.li>
                                {/* Puedes añadir más links públicos aquí */}
                            </>
                        )}
                    </ul>
                </nav>
                
                {/* Sección de Usuario / Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4 font-sans relative">
                    {user ? (
                        user.tipoUsuario === "Docente" ? (
                            <div className="relative">
                                <button
                                    onClick={handleDropdown}
                                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                >
                                    <span>👨‍🏫 {user.nombre}</span>
                                    <svg className={`w-4 h-4 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-100 animate-fade-in">
                                        <Link
                                            to="/crear-examen"
                                            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                                            onClick={closeDropdown}
                                        >
                                            ➕ Crear nuevo examen
                                        </Link>
                                        <Link
                                            to="/formulario-pregunta"
                                            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors"
                                            onClick={closeDropdown}
                                        >
                                            ❓ Crear pregunta
                                        </Link>
                                        <button
                                            onClick={handleAuthClick}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors border-t border-gray-100"
                                        >
                                            🚪 Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-3"
                            >
                                <span className="text-sm font-semibold text-indigo-800">
                                    👨‍🎓 Estudiante {user.nombre}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAuthClick}
                                    className="transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg px-4 py-1.5 rounded-lg text-sm font-medium"
                                >
                                    Cerrar sesión
                                </motion.button>
                            </motion.div>
                        )
                    ) : (
                        <div className="flex items-center space-x-3">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/registro"
                                    className={`transition-all duration-300 text-indigo-600 hover:text-indigo-800 font-medium text-sm`}
                                >
                                    Registrarse
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/login"
                                    className={`transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg px-4 py-1.5 rounded-lg text-sm font-medium`}
                                >
                                    Iniciar Sesión
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            {/* Menú móvil (solo visible cuando isOpen es true) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg shadow-inner py-4"
                    >
                        <ul className="flex flex-col items-center space-y-4">
                            {user ? (
                                <>
                                    <motion.li whileTap={{ scale: 0.95 }}>
                                        <Link 
                                            to={user.tipoUsuario === "Estudiante" ? "/home-estudiante" : "/home-profe"} 
                                            className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                            onClick={() => setIsOpen(false)} // Cerrar menú al hacer clic
                                        >
                                            🏠<span className="ml-1">Inicio</span>
                                        </Link>
                                    </motion.li>
                                    <motion.li whileTap={{ scale: 0.95 }}>
                                        <Link 
                                            to={user.tipoUsuario === "Estudiante" ? "/examenes-estudiante" : "/examenes-docente"} 
                                            className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            📝<span className="ml-1">Exámenes</span>
                                        </Link>
                                    </motion.li>
                                    <motion.li whileTap={{ scale: 0.95 }}>
                                        <Link 
                                            to="/estadisticas" 
                                            className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            📊<span className="ml-1">Estadísticas</span>
                                        </Link>
                                    </motion.li>
                                    {/* User Info and Logout in Mobile */}
                                    <li className="pt-4 border-t border-gray-200 w-full text-center">
                                        <span className="text-sm font-semibold text-indigo-800 block mb-2">
                                            {user.tipoUsuario === "Estudiante" ? "👨‍🎓 Estudiante" : "👨‍🏫 Docente"} {user.nombre}
                                        </span>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => { handleAuthClick({preventDefault: () => {}}); setIsOpen(false); }}
                                            className="transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg px-4 py-1.5 rounded-lg text-sm font-medium"
                                        >
                                            Cerrar sesión
                                        </motion.button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <motion.li whileTap={{ scale: 0.95 }}>
                                        <Link 
                                            to="/" 
                                            className="text-base font-medium text-indigo-800 hover:text-indigo-600 transition-colors flex items-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            🏠<span className="ml-1">Inicio</span>
                                        </Link>
                                    </motion.li>
                                    <motion.li whileTap={{ scale: 0.95 }}>
                                        <Link
                                            to="/registro"
                                            className={`transition-all duration-300 text-indigo-600 hover:text-indigo-800 font-medium text-sm`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Registrarse
                                        </Link>
                                    </motion.li>
                                    <motion.li whileTap={{ scale: 0.95 }}>
                                        <Link
                                            to="/login"
                                            className={`transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg px-4 py-1.5 rounded-lg text-sm font-medium`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Iniciar Sesión
                                        </Link>
                                    </motion.li>
                                </>
                            )}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;

