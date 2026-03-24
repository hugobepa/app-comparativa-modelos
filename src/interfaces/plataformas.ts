export interface Plataforma {
  id: string;
  nombre: string;
  url: string;
  descripcion?: string;
  modelos?: string[];
  precios?: Record<string, { input: number; output: number }>;
}

export interface PlataformaDetalle extends Plataforma {
  modelosDisponibles: ModeloInfo[];
}

export interface ModeloInfo {
  id: string;
  nombre: string;
  precioInput: number;
  precioOutput: number;
}