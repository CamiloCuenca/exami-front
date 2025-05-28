import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import Navbar from "../components/navbar";

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
        <div style={{ width: "100%", minHeight: "100vh", background: "#f3f4f6" }}>
            <Navbar />
            <div style={{ padding: "2rem 0", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                <h2>Estadísticas de tus exámenes</h2>
                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && examenes.length === 0 && (
                    <p>No hay estadísticas disponibles.</p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, justifyItems: "center", marginTop: 32 }}>
                    {examenes.map((examen, idx) => {
                        // Adaptar a los nombres reales del backend y convertir coma a punto
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
                            <div key={idx} style={{ background: "#f9fafb", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px #0001", minWidth: 250, maxWidth: 300, margin: "1rem auto" }}>
                                <h3 style={{ marginBottom: 8 }}>{examen.NOMBRE_EXAMEN || "Examen"}</h3>
                                <div style={{ width: 200, height: 200, margin: "1rem auto", position: "relative" }}>
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
                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "1.7rem",
                                        fontWeight: "bold",
                                        color: "#374151"
                                    }}>
                                        {porcentaje.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;