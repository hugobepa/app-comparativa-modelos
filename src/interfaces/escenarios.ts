export interface Escenario {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'chat' | 'completado' | 'embeddings' | 'imagen' | 'audio';
  volumenTokens: {
    input: number;
    output: number;
  };
  frecuencia: 'bajo' | 'medio' | 'alto';
  presupuesto: 'bajo' | 'medio' | 'alto';
  requisitos?: {
    contexto?: number;
    multimodal?: boolean;
    velocidad?: 'alta' | 'media' | 'baja';
  };
}

export interface EscenarioConCosto extends Escenario {
  costosEstimados: Array<{
    modeloId: string;
    costoDiario: number;
    costoMensual: number;
  }>;
}