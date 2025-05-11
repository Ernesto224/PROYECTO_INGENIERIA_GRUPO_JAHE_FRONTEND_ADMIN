import { HabitacionConsultaDTO } from "./HabitacionConsultaDTO";

export interface ResultadoConsultaHabitacionDTO {
    lista: HabitacionConsultaDTO[];
    totalRegistros: number;
    paginaActual: number;
    totalPaginas: number;
    maximoPorPagina: number;
}