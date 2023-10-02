import { SaleDetail } from "./sale-detail";

export interface Sale {
  idVenta?: number,
  numeroDocumento?: string,
  tipoPago: string,
  total: number,
  fechaRegistro?: Date,
  detalleVenta: SaleDetail[]
}
