/**
 * TypeScript interfaces for benchmarks
 * @module interfaces/benchmarks
 */

/** Benchmark source */
export type FuenteBenchmark =
  | "swe-bench"
  | "live-code-bench"
  | "humaneval"
  | "mbpp"
  | "bigcodebench";

/** Benchmark entry */
export interface EntradaBenchmark {
  /** Model ID */
  modeloId: string;
  /** Model name */
  modeloNombre: string;
  /** Benchmark source */
  fuente: FuenteBenchmark;
  /** Score (percentage or absolute) */
  puntuacion: number;
  /** Maximum possible score */
  puntuacionMaxima?: number;
  /** Ranking position */
  ranking: number;
  /** Total models in benchmark */
  totalModelos?: number;
  /** Date of benchmark */
  fecha: string;
  /** Source URL */
  fuenteUrl?: string;
}

/** Benchmark summary for a model */
export interface ResumenBenchmark {
  /** Model ID */
  modeloId: string;
  /** Average score across benchmarks */
  puntuacionMedia: number;
  /** Overall ranking */
  rankingGeneral: number;
  /** Individual benchmark results */
  resultados: EntradaBenchmark[];
  /** Strengths */
  fortalezas: string[];
  /** Weaknesses */
  debilidades: string[];
}

/** Benchmark comparison chart data */
export interface DatosGraficoBenchmark {
  /** Labels (model names) */
  etiquetas: string[];
  /** Datasets */
  datasets: {
    /** Benchmark name */
    nombre: string;
    /** Color */
    color: string;
    /** Values */
    valores: number[];
  }[];
}
