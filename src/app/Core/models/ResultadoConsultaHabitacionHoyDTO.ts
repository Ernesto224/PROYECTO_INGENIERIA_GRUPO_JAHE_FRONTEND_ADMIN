import { HabitacionDTO } from "./HabitacionDTO";

export interface ResultadoConsultaHabitacionHoyDTO {
    lista: HabitacionDTO[];
    totalRegistros: number;
    paginaActual: number;
    totalPaginas: number;
    maximoPorPagina: number;
}