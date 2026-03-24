export interface Modelo {
  id: string;
  nombre: string;
  proveedor: string;
  categoria: 'flagship' | 'standard' | 'economic' | 'specialized';
  contexto: number;
  precio: {
    input: number;
    output: number;
    moneda?: string;
  };
  caracteristicas?: string[];
  disponibleEn?: string[];
  descripcion?: string;
  lanzamiento?: string;
  benchmarks?: Record<string, number>;
}

export interface Plataforma {
  id: string;
  nombre: string;
  url: string;
  descripcion?: string;
  modelos?: string[];
  precios?: Record<string, { input: number; output: number }>;
}

export interface Benchmark {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  resultados: Record<string, number>;
}

export interface Recomendacion {
  id: string;
  titulo: string;
  escenario: string;
  descripcion: string;
  modelosRecomendados: Array<{
    id: string;
    razon: string;
  }>;
  criterios?: {
    presupuesto?: 'bajo' | 'medio' | 'alto';
    uso?: string;
    volumen?: 'bajo' | 'medio' | 'alto';
  };
}