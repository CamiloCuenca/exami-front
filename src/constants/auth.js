// Códigos de resultado para login
export const LOGIN_EXITOSO = 1;
export const LOGIN_USUARIO_NO_ENCONTRADO = -1;
export const LOGIN_CUENTA_INACTIVA = -2;
export const LOGIN_CUENTA_BLOQUEADA = -3;
export const LOGIN_CONTRASENA_INCORRECTA = -4;
export const LOGIN_ERROR_INESPERADO = -99;

// Códigos de resultado para recuperación de cuenta
export const RECUPERACION_EXITOSA = 1;
export const RECUPERACION_USUARIO_NO_ENCONTRADO = -1;
export const RECUPERACION_CUENTA_NO_BLOQUEADA = -2;
export const RECUPERACION_ERROR_INESPERADO = -99;

// Códigos de resultado del procedimiento almacenado para registro
export const COD_EXITO = 0;
export const COD_EMAIL_YA_EXISTE = 1;
export const COD_ERROR_PARAMETROS = 2;
export const COD_ERROR_REGISTRO = 3;
export const COD_TIPO_USUARIO_INVALIDO = 4;
export const COD_ESTADO_INVALIDO = 5;
export const COD_ERROR_SECUENCIA = 6;

// Códigos de tipos de usuario
export const TIPO_ESTUDIANTE = 1;
export const TIPO_PROFESOR = 2;
export const TIPO_ADMIN = 3;

// Códigos de estado de usuario
export const ESTADO_ACTIVO = 1;
export const ESTADO_INACTIVO = 2;
export const ESTADO_BLOQUEADO = 3; 