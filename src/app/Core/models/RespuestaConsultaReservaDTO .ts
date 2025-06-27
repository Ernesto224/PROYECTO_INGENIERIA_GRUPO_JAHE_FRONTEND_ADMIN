import { ReservacionDTO } from "./ReservacionDTO";

export interface RespuestaConsultaReservaDTO {
  lista: ReservacionDTO[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
  maximoPorPagina: number;
}