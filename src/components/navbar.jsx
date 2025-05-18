import React from "react";

const Header = () => {
    const isLoggedIn = !!localStorage.getItem("user");

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow font-inherit">
            <a className="text-2xl font-bold text-gray-800" href="#">
                EXAMI
            </a>
            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-inherit"
                >
                    Cerrar Sesión
                </button>
            ) : (
                <a
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-inherit"
                >
                    Iniciar Sesión
                </a>
            )}
        </header>
    );
};

export default Header;