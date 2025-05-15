import React from "react";

const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <a className="text-2xl font-bold text-gray-800" href="#">
            EXAMI
        </a>
        <a
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Iniciar Sesión
        </a>
    </header>
);

export default Header;