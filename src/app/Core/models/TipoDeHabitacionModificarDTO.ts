export interface TipoDeHabitacionActualizarDTO {
    idTipoDeHabitacion: number;
    nombre: string;
    descripcion: string;
    tarifaDiaria: number;
    imagen: string | null;        // base64
    nombreArchivo: string;        // nombre original del archivo
}