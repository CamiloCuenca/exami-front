import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../components/navbar";
import { motion } from "framer-motion";

Chart.register(ArcElement, Tooltip, Legend);

const Estadisticas = () => {
    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener usuario del localStorage
        const userStr = localStorage.getItem("user");
        let idUsuario = null;
        try {
            if (userStr) {
                const user = JSON.parse(userStr);
                idUsuario = user.idUsuario || user.id || user.id_estudiante || user.idEstudiante;
            }
        } catch (e) {
            setError("No se pudo leer el usuario del localStorage.");
            setLoading(false);
            return;
        }
        if (!idUsuario) {
            setError("No se encontró el id del usuario en localStorage.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        axios
            .get(`http://localhost:8082/api/pregunta/examenes-porcentajes/${idUsuario}`)
            .then((res) => {
                console.log("Respuesta del backend:", res.data); // <-- Mostrar en consola
                setExamenes(res.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudo obtener las estadísticas de los exámenes.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center font-heading">
                        Estadísticas de tus Exámenes
                    </h1>

                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {!loading && !error && examenes.length === 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <p className="text-gray-600">No hay estadísticas disponibles.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {examenes.map((examen, idx) => {
                            const porcentaje = Number(
                                typeof examen.PORCENTAJE === "string"
                                    ? examen.PORCENTAJE.replace(",", ".")
                                    : examen.PORCENTAJE
                            ) || 0;

                            const data = {
                                labels: ["Correctas", "Incorrectas"],
                                datasets: [
                                    {
                                        data: [porcentaje, 100 - porcentaje],
                                        backgroundColor: [
                                            porcentaje >= 60 ? "#22c55e" : "#f59e42",
                                            "#e5e7eb"
                                        ],
                                        borderWidth: 2,
                                    },
                                ],
                            };

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                >
                                    <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center font-heading">
                                        {examen.NOMBRE_EXAMEN || "Examen"}
                                    </h3>
                                    <div className="relative w-48 h-48 mx-auto">
                                        <Doughnut
                                            data={data}
                                            options={{
                                                cutout: "70%",
                                                plugins: {
                                                    legend: { display: false },
                                                    tooltip: { enabled: true }
                                                }
                                            }}
                                        />
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                            <span className="text-3xl font-bold text-gray-800">
                                                {porcentaje.toFixed(1)}%
                                            </span>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {porcentaje >= 60 ? "Aprobado" : "Reprobado"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            porcentaje >= 60 
                                                ? "bg-green-100 text-green-800" 
                                                : "bg-orange-100 text-orange-800"
                                        }`}>
                                            {porcentaje >= 60 ? "¡Buen trabajo!" : "Necesitas mejorar"}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Estadisticas;