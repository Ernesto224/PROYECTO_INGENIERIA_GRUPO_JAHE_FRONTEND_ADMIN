import { TipoDeHabitacionConsultaDTO } from "./TipoDeHabitacionConsultaDTO";

export interface HabitacionConsultaDTO {
    idHabitacion: number;
    numero: number;
    tipoDeHabitacion: TipoDeHabitacionConsultaDTO;
}