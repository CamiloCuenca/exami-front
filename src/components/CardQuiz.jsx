import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function CardQuizList() {
    const [examenes, setExamenes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUsuario) return;
        const idEstudiante = user.idUsuario;
        api.get(`/quiz/estudiante/${idEstudiante}/examenes`)
            .then((res) => {
                setExamenes(res.data);
            })
            .catch(() => {
                Swal.fire("Error", "No se pudieron cargar los exámenes", "error");
            });
    }, []);

    return (
        <div className="flex flex-row flex-wrap gap-6 justify-center w-full">
            {examenes.map((examen) => (
                <CardQuiz
                    key={examen.idExamen}
                    nombre={examen.nombre}
                    descripcion={examen.descripcion}
                    estado={examen.estado}
                />
            ))}
        </div>
    );
}
export { CardQuizList };

const statusStyles = {
    Finalizado: "bg-red-100 text-red-700 border-red-400",
    Disponible: "bg-green-100 text-green-700 border-green-400",
};

function CardQuiz({ nombre, descripcion, estado }) {
    return (
        <div className="flex flex-row items-center w-full max-w-md p-6 rounded-xl shadow-lg border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 transition-all hover:shadow-2xl hover:scale-[1.02] duration-200">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">{nombre}</h2>
                <p className="text-gray-600 mb-4">{descripcion}</p>
                <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded border ${statusStyles[estado] || "bg-gray-100 text-gray-700 border-gray-300"}`}
                >
                    {estado}
                </span>
            </div>
        </div>
    );
}

export default CardQuiz;
