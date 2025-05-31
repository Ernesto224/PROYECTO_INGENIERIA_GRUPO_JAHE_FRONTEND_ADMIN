import { TipoDeHabitacionConsultaDTO } from "./TipoDeHabitacionConsultaDTO";

export interface HabitacionDTO {
    idHabitacion: number;
    numero: number;
    estado: string;
    tipoDeHabitacion: TipoDeHabitacionConsultaDTO;
}