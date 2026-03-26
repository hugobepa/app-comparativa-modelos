/**
 * TypeScript interfaces for platforms
 * @module interfaces/plataformas
 */

/** Platform types */
export type TipoPlataforma = "copilot" | "openrouter" | "zen";

/** Subscription plan types */
export type TipoPlan = "free" | "pro" | "pro-plus" | "team" | "enterprise";

/** Routing strategy */
export type EstrategiaRouting =
  | "auto"
  | "manual"
  | "cost-optimized"
  | "performance-optimized";

/** Pricing plan */
export interface PlanPrecio {
  /** Plan identifier */
  id: string;
  /** Plan name */
  nombre: string;
  /** Monthly price in USD */
  precioMensual: number;
  /** Annual price in USD (if available) */
  precioAnual?: number;
  /** Plan type */
  tipo: TipoPlan;
  /** Features included */
  caracteristicas: string[];
  /** Usage limits */
  limites?: {
    /** Requests per day */
    peticionesDia?: number;
    /** Tokens per month */
    tokensMes?: number;
    /** Models available */
    modelosDisponibles?: number;
  };
}

/** Routing configuration */
export interface ConfiguracionRouting {
  /** Routing strategy */
  estrategia: EstrategiaRouting;
  /** Fallback model */
  fallback?: string;
  /** Custom routing rules */
  reglas?: ReglaRouting[];
}

/** Routing rule */
export interface ReglaRouting {
  /** Condition (e.g., 'code', 'analysis') */
  condicion: string;
  /** Target model */
  modelo: string;
  /** Priority */
  prioridad: number;
}

/** Platform */
export interface Plataforma {
  /** Unique identifier */
  id: string;
  /** Display name */
  nombre: string;
  /** Platform type */
  tipo: TipoPlataforma;
  /** Description */
  descripcion: string;
  /** Available plans */
  planes: PlanPrecio[];
  /** Routing configuration */
  routing?: ConfiguracionRouting;
  /** Available models (IDs) */
  modelosDisponibles: string[];
  /** Pros */
  ventajas: string[];
  /** Cons */
  desventajas: string[];
  /** Website URL */
  url: string;
  /** Last update */
  fechaActualizacion: string;
}

/** Platform comparison result */
export interface ComparacionPlataforma {
  plataforma: Plataforma;
  /** Total monthly cost for scenario */
  costeMensual: number;
  /** Value score */
  puntuacionValor: number;
  /** Recommended for profiles */
  perfilesRecomendados: string[];
}
