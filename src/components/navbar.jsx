import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    
    // Detectar cuando el usuario hace scroll para añadir sombra y/o efectos adicionales
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            if (currentScrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Limpieza del event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Verificar si hay un usuario en localStorage
    const user = localStorage.getItem("user");

    // Función para manejar cerrar sesión
    const handleAuthClick = (e) => {
        if (user) {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.reload();
        }
    };

    return (
        <motion.header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg backdrop-blur-md bg-white/90' : 'bg-white'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Barra decorativa superior con el gradiente */}
            <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ backgroundImage: 'var(--gradient-header)' }}></div>
            
            <div className={`flex items-center justify-between px-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
                <Link to="/" className="flex items-center space-x-2 relative">
                    <motion.div 
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundImage: 'linear-gradient(to right bottom, var(--color-indigo), var(--color-accent))' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-white text-lg font-bold">E</span>
                    </motion.div>
                    <motion.span 
                        className="text-2xl font-bold" 
                        style={{ color: 'var(--color-text-secondary)' }}
                        animate={{ opacity: isScrolled ? 1 : 1 }}
                    >
                        EXAMI
                    </motion.span>
                    {isScrolled && (
                        <motion.div 
                            className="absolute -bottom-1 left-0 right-0 h-0.5" 
                            style={{ backgroundImage: 'var(--gradient-header)' }}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        />
                    )}
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
                
                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="#"
                                onClick={handleAuthClick}
                                className={`transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg px-5 py-2 rounded-lg`}
                            >
                                Cerrar sesión
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mr-2"
                            >
                                <Link
                                    to="/registro"
                                    className={`transition-all duration-300 ${
                                        isScrolled 
                                        ? 'bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-lg' 
                                        : 'btn-secondary'
                                    }`}
                                >
                                    Registrarse
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/login"
                                    className={`transition-all duration-300 ${
                                        isScrolled 
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg px-5 py-2 rounded-lg' 
                                        : 'btn-primary'
                                    }`}
                                >
                                    Iniciar Sesión
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Indicador de progreso de scroll */}
            <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500"
                style={{ width: `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`,
                         opacity: isScrolled ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            ></motion.div>
        </motion.header>
    );
};

export default Header;

