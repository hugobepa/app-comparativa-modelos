import type { Modelo, Plataforma, Benchmark, Recomendacion } from '../interfaces/modelos';

export interface ComparacionResultado {
  modelo: Modelo;
  puntuacionTotal: number;
  precioEstimado: number;
  fortalezas: string[];
  debilidades: string[];
}

export function calcularPuntuacion(
  modelo: Modelo, 
  criterios: {
    prioridadPrecio: number;
    prioridadVelocidad: number;
    prioridadCalidad: number;
    prioridadContexto: number;
  }
): number {
  const { prioridadPrecio, prioridadVelocidad, prioridadCalidad, prioridadContexto } = criterios;
  
  // Normalizar precios (menor es mejor)
  const precioNormalizado = modelo.precio.input > 0 
    ? Math.max(0, 100 - (modelo.precio.input * 1000)) 
    : 100;
  
  // Normalizar contexto (mayor es mejor)
  const contextoNormalizado = Math.min(100, modelo.contexto / 100000);
  
  // Puntuación base por categoría
  const categoriaPuntuacion: Record<string, number> = {
    'flagship': 100,
    'standard': 75,
    'economic': 50,
    'specialized': 80
  };
  
  const puntuacionBase = categoriaPuntuacion[modelo.categoria] || 50;
  
  return (
    precioNormalizado * prioridadPrecio +
    contextoNormalizado * prioridadContexto +
    puntuacionBase * prioridadCalidad
  );
}

export function compararModelos(
  modelos: Modelo[],
  criterios: {
    prioridadPrecio: number;
    prioridadVelocidad: number;
    prioridadCalidad: number;
    prioridadContexto: number;
  }
): ComparacionResultado[] {
  return modelos
    .map(modelo => ({
      modelo,
      puntuacionTotal: calcularPuntuacion(modelo, criterios),
      precioEstimado: modelo.precio.input,
      fortalezas: obtenerFortalezas(modelo),
      debilidades: obtenerDebilidades(modelo)
    }))
    .sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);
}

function obtenerFortalezas(modelo: Modelo): string[] {
  const fortalezas: string[] = [];
  
  if (modelo.precio.input === 0) {
    fortalezas.push('Gratis');
  } else if (modelo.precio.input < 0.5) {
    fortalezas.push('Precio bajo');
  }
  
  if (modelo.contexto >= 100000) {
    fortalezas.push('Ventana de contexto grande');
  }
  
  if (modelo.categoria === 'flagship') {
    fortalezas.push('Máxima calidad');
  }
  
  if (modelo.caracteristicas?.includes('multimodal')) {
    fortalezas.push('Multimodal');
  }
  
  return fortalezas;
}

function obtenerDebilidades(modelo: Modelo): string[] {
  const debilidades: string[] = [];
  
  if (modelo.precio.input > 5) {
    debilidades.push('Precio alto');
  }
  
  if (modelo.contexto < 10000) {
    debilidades.push('Contexto limitado');
  }
  
  if (modelo.categoria === 'economic') {
    debilidades.push('Menor capacidad');
  }
  
  return debilidades;
}

export function formatearPrecio(precio: number): string {
  if (precio === 0) return 'Gratis';
  if (precio < 0.01) return `$${precio.toFixed(6)}`;
  if (precio < 1) return `$${precio.toFixed(4)}`;
  return `$${precio.toFixed(2)}`;
}

export function formatearContexto(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
  return tokens.toString();
}