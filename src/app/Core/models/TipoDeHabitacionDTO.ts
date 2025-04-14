import { Imagen } from './ImagenDTO';

export interface TipoDeHabitacionDTO {
    idTipoDeHabitacion: number;
    nombre: string;
    descripcion: string;
    tarifaDiaria: number;
    imagen: Imagen;
}