export interface NivelDificultadDTO {
    idNivelDificultad: number;
    nombre: string;
    descripcion: string;
}

export interface TipoPreguntaDTO {
    idTipoPregunta: number;
    nombre: string;
    descripcion: string;
}

export interface TemaDTO {
    id_tema: number;
    nombre: string;
    descripcion?: string;
}

export interface CategoriaDTO {
    id_categoria: number;
    nombre: string;
    descripcion?: string;
}

export interface PreguntaDTO {
    idDocente: number;
    idTema: number;
    idNivelDificultad: number;
    idTipoPregunta: number;
    textoPregunta: string;
    esPublica: number;
    tiempoMaximo: number;
    porcentaje: number;
    idPreguntaPadre: number | null;
    textosOpciones: string[];
    sonCorrectas: number[];
    ordenes: number[];
} 