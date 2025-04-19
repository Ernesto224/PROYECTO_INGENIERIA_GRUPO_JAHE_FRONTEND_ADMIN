import { TipoDeHabitacionDTO } from './TipoDeHabitacionDTO';

export interface EstadoHabitacionDTO {
    idHabitacion: number;
    numero: number;
    estado: string;
    tipoDeHabitacion: TipoDeHabitacionDTO;
}