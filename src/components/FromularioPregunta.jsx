import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const defaultPregunta = {
    idDocente: 1,
    idTema: 1,
    idNivelDificultad: 1,
    idTipoPregunta: 1,
    textoPregunta: "",
    esPublica: 1,
    tiempoMaximo: 30,
    porcentaje: 100.0,
    textosOpciones: ["", "", "", ""],
    sonCorrectas: [0, 0, 0, 0],
    ordenes: [1, 2, 3, 4],
};

const FormularioPregunta = () => {
    const { idExamen } = useParams();
    const [preguntas, setPreguntas] = useState([ { ...defaultPregunta, idExamen: idExamen ? Number(idExamen) : undefined } ]);
    const [loading, setLoading] = useState(false);

    const handlePreguntaChange = (idx, field, value) => {
        const updated = preguntas.map((p, i) =>
            i === idx ? { ...p, [field]: value } : p
        );
        setPreguntas(updated);
    };

    const handleOpcionChange = (idxPregunta, idxOpcion, value) => {
        const updated = preguntas.map((p, i) => {
            if (i !== idxPregunta) return p;
            const textosOpciones = [...p.textosOpciones];
            textosOpciones[idxOpcion] = value;
            return { ...p, textosOpciones };
        });
        setPreguntas(updated);
    };

    const handleCorrectaChange = (idxPregunta, idxOpcion, checked) => {
        const updated = preguntas.map((p, i) => {
            if (i !== idxPregunta) return p;
            const sonCorrectas = [...p.sonCorrectas];
            sonCorrectas[idxOpcion] = checked ? 1 : 0;
            return { ...p, sonCorrectas };
        });
        setPreguntas(updated);
    };

    const agregarPregunta = () => {
        setPreguntas([...preguntas, { ...defaultPregunta, idExamen: idExamen ? Number(idExamen) : undefined }]);
    };

    const eliminarPregunta = (idx) => {
        setPreguntas(preguntas.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            for (const pregunta of preguntas) {
                await axios.post("/examen/Crear", { ...pregunta, idExamen: idExamen ? Number(idExamen) : undefined });
            }
            alert("Preguntas enviadas correctamente");
            setPreguntas([{ ...defaultPregunta, idExamen: idExamen ? Number(idExamen) : undefined }]);
        } catch (err) {
            alert("Error al enviar las preguntas");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {preguntas.map((pregunta, idx) => (
                <div key={idx} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
                    <h4>Pregunta {idx + 1}</h4>
                    <label>
                        Texto de la pregunta:
                        <input
                            type="text"
                            value={pregunta.textoPregunta}
                            onChange={e => handlePreguntaChange(idx, "textoPregunta", e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Tiempo máximo (segundos):
                        <input
                            type="number"
                            value={pregunta.tiempoMaximo}
                            onChange={e => handlePreguntaChange(idx, "tiempoMaximo", Number(e.target.value))}
                            min={1}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Porcentaje:
                        <input
                            type="number"
                            value={pregunta.porcentaje}
                            onChange={e => handlePreguntaChange(idx, "porcentaje", Number(e.target.value))}
                            min={0}
                            max={100}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Es pública:
                        <input
                            type="checkbox"
                            checked={pregunta.esPublica === 1}
                            onChange={e => handlePreguntaChange(idx, "esPublica", e.target.checked ? 1 : 0)}
                        />
                    </label>
                    <br />
                    <div>
                        <strong>Opciones:</strong>
                        {pregunta.textosOpciones.map((opcion, idxOpcion) => (
                            <div key={idxOpcion}>
                                <input
                                    type="text"
                                    value={opcion}
                                    placeholder={`Opción ${idxOpcion + 1}`}
                                    onChange={e => handleOpcionChange(idx, idxOpcion, e.target.value)}
                                    required
                                />
                                <label>
                                    Correcta
                                    <input
                                        type="checkbox"
                                        checked={pregunta.sonCorrectas[idxOpcion] === 1}
                                        onChange={e => handleCorrectaChange(idx, idxOpcion, e.target.checked)}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    {preguntas.length > 1 && (
                        <button type="button" onClick={() => eliminarPregunta(idx)}>
                            Eliminar pregunta
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={agregarPregunta}>
                Agregar otra pregunta
            </button>
            <br />
            <button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar preguntas"}
            </button>
        </form>
    );
};

export default FormularioPregunta;