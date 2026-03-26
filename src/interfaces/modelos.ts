/**
 * TypeScript interfaces for LLM models
 * @module interfaces/modelos
 */

/** LLM model providers */
export type ProveedorModelo =
  | "anthropic"
  | "openai"
  | "google"
  | "deepseek"
  | "alibaba"
  | "moonshot"
  | "zhipu"
  | "minimax"
  | "openrouter";

/** Model category based on price/performance */
export type CategoriaModelo = "premium" | "estandar" | "economico";

/** Benchmark types */
export type TipoBenchmark =
  | "swe-bench-verified"
  | "live-code-bench"
  | "humaneval"
  | "mbpp";

/** Price structure for a model */
export interface PrecioModelo {
  /** Input price in USD per 1M tokens */
  input: number;
  /** Output price in USD per 1M tokens */
  output: number;
  /** Cached input price if available */
  cacheHit?: number;
  /** Currency (default: USD) */
  moneda?: string;
}

/** Benchmark result */
export interface Benchmark {
  /** Benchmark type */
  tipo: TipoBenchmark;
  /** Score/percentage */
  puntuacion: number;
  /** Ranking position */
  ranking?: number;
  /** Date of benchmark */
  fecha: string;
  /** Source URL */
  fuente?: string;
}

/** Context window configuration */
export interface ContextoVentana {
  /** Maximum context tokens */
  maximo: number;
  /** Effective context for coding */
  efectivo?: number;
}

/** Model capabilities */
export interface CapacidadesModelo {
  /** Supports function calling */
  functionCalling: boolean;
  /** Supports vision/image input */
  vision: boolean;
  /** Supports code execution */
  codeExecution: boolean;
  /** Supports streaming */
  streaming: boolean;
  /** Maximum output tokens */
  maxOutputTokens?: number;
}

/** LLM Model */
export interface Modelo {
  /** Unique identifier (slug) */
  id: string;
  /** Display name */
  nombre: string;
  /** Provider */
  proveedor: ProveedorModelo;
  /** Category */
  categoria: CategoriaModelo;
  /** Pricing */
  precio: PrecioModelo;
  /** Benchmark results */
  benchmarks: Benchmark[];
  /** Context window */
  contextoVentana: ContextoVentana;
  /** Capabilities */
  capacidades?: CapacidadesModelo;
  /** Last update date */
  fechaActualizacion: string;
  /** Notes or comments */
  notas?: string;
  /** Provider model ID */
  providerId?: string;
}

/** Model comparison data */
export interface ComparacionModelo {
  modelo: Modelo;
  /** Cost per 1000 requests (estimated) */
  costeEstimado: number;
  /** Performance score (0-100) */
  puntuacionRendimiento: number;
  /** Value score (performance/price) */
  puntuacionValor: number;
}
