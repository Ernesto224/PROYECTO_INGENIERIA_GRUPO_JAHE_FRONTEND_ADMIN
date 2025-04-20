import { HabitacionConsultaDTO } from "./HabitacionConsultaDTO";

export interface ResultadoConsultaHabitacionDTO {
    habitaciones: HabitacionConsultaDTO[];
    totalRegistros: number;
    paginaActual: number;
    totalPaginas: number;
    maximoPorPagina: number;
}