import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const contrasena = form.contrasena.value;

        try {
            const response = await api.post("/auth/login", { email, contrasena });

            if (response.data.codigoResultado === 1) {
                Swal.fire("Éxito", "Bienvenido!", "success");
                // Redirigir al dashboard o guardar token
            } else {
                let errorMessage = "Error desconocido";
                switch(response.data.codigoResultado) {
                    case -1: errorMessage = "Usuario no encontrado"; break;
                    case -2: errorMessage = "Cuenta inactiva"; break;
                    case -3: errorMessage = "Cuenta bloqueada"; break;
                    case -4: errorMessage = "Contraseña incorrecta"; break;
                }
                Swal.fire("Error", errorMessage, "error");
            }
        } catch (error) {
            if (error.response) {
                Swal.fire("Error", "Problema con el servidor", "error");
            } else {
                Swal.fire("Error", "No se pudo conectar al servidor", "error");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-light)]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 pt-12 relative">
                {/* Flecha para regresar al home */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 p-1 rounded-full bg-[var(--color-gray-light)] hover:bg-[var(--color-primary)] transition-colors focus:outline-none"
                    aria-label="Regresar al inicio"
                    
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-3 md:w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ color: "var(--color-secondary)" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-center mb-8 text-[var(--color-secondary)] mt-2">
                    Iniciar Sesión
                </h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-[var(--color-secondary)] mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-[var(--color-gray-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-gray-light)]"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="contrasena"
                            className="block text-sm font-semibold text-[var(--color-secondary)] mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            required
                            className="w-full px-4 py-2 border border-[var(--color-gray-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-gray-light)]"
                            placeholder="Tu contraseña"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-colors"
                    >
                        Ingresar
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <a
                        href="#"
                        className="text-sm text-[var(--color-accent)] hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>
        </div>
    );
}