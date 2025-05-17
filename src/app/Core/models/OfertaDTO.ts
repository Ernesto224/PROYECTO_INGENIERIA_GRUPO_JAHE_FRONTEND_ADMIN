import { TipoDeHabitacionDTO } from "./TipoDeHabitacionDTO";
import { Imagen } from "./ImagenDTO";

export interface OfertaDTO {
    idOferta: number;
    nombre: string;
    fechaInicio: Date;
    fechaFinal: Date;
    porcentaje: number;
    activo: boolean;
    tipoDeHabitacion: TipoDeHabitacionDTO;
    imagen: Imagen;
}
