/**
 * TypeScript interfaces for usage scenarios
 * @module interfaces/escenarios
 */

/** Usage profile type */
export type PerfilUso = "casual" | "profesional" | "enterprise";

/** Task type */
export type TipoTarea =
  | "planificacion"
  | "coding"
  | "debugging"
  | "testing"
  | "refactoring"
  | "documentacion";

/** Usage scenario */
export interface EscenarioUso {
  /** Scenario identifier */
  id: string;
  /** Scenario name */
  nombre: string;
  /** Description */
  descripcion: string;
  /** Usage profile */
  perfil: PerfilUso;
  /** Hours per month */
  horasMes: number;
  /** Estimated tokens per hour */
  tokensHora: number;
  /** Typical tasks */
  tareas: TipoTarea[];
  /** Distribution of tasks */
  distribucionTareas?: Record<TipoTarea, number>;
}

/** Cost calculation result */
export interface CalculoCoste {
  /** Platform or model ID */
  id: string;
  /** Name */
  nombre: string;
  /** Monthly cost in USD */
  costeMensual: number;
  /** Cost breakdown */
  desglose: {
    /** Input tokens cost */
    input: number;
    /** Output tokens cost */
    output: number;
    /** Subscription cost (if applicable) */
    suscripcion?: number;
  };
  /** Total tokens estimated */
  tokensEstimados: {
    input: number;
    output: number;
  };
}

/** Recommendation */
export interface Recomendacion {
  /** Recommendation ID */
  id: string;
  /** Target profile */
  perfil: PerfilUso;
  /** Recommended platform/model */
  recomendado: string;
  /** Reason */
  razon: string;
  /** Alternative options */
  alternativas: string[];
  /** Estimated savings vs premium */
  ahorroEstimado?: number;
  /** Priority (1-5) */
  prioridad: number;
}

/** Calculator input */
export interface InputCalculadora {
  /** Hours per month */
  horasMes: number;
  /** Usage profile */
  perfil: PerfilUso;
  /** Preferred provider (optional) */
  proveedorPreferido?: string;
  /** Budget limit (optional) */
  presupuestoMaximo?: number;
}

/** Calculator output */
export interface OutputCalculadora {
  /** All calculations */
  calculos: CalculoCoste[];
  /** Best value option */
  mejorOpcion: CalculoCoste;
  /** Cheapest option */
  opcionMasBarata: CalculoCoste;
  /** Best performance option */
  mejorRendimiento: CalculoCoste;
  /** Recommendations */
  recomendaciones: Recomendacion[];
}
