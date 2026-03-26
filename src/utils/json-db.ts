/**
 * JSON data loader utility
 * @module utils/json-db
 */

import type { CalculoCoste, EscenarioUso } from "@interfaces/escenarios";
import type { Modelo } from "@interfaces/modelos";
import type { Plataforma } from "@interfaces/plataformas";

/** Base URL for data files */
const DATA_BASE_URL = "/data";

/**
 * Load JSON data from public folder
 */
async function loadJSON<T>(filename: string): Promise<T> {
  const response = await fetch(`${DATA_BASE_URL}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${filename}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Load all models
 */
export async function loadModelos(): Promise<Modelo[]> {
  return loadJSON<Modelo[]>("modelos.json");
}

/**
 * Load all platforms
 */
export async function loadPlataformas(): Promise<Plataforma[]> {
  return loadJSON<Plataforma[]>("plataformas.json");
}

/**
 * Load all scenarios
 */
export async function loadEscenarios(): Promise<EscenarioUso[]> {
  return loadJSON<EscenarioUso[]>("escenarios.json");
}

/**
 * Get model by ID
 */
export async function getModeloById(id: string): Promise<Modelo | undefined> {
  const modelos = await loadModelos();
  return modelos.find((m) => m.id === id);
}

/**
 * Get platform by ID
 */
export async function getPlataformaById(
  id: string,
): Promise<Plataforma | undefined> {
  const plataformas = await loadPlataformas();
  return plataformas.find((p) => p.id === id);
}

/**
 * Filter models by provider
 */
export async function filterModelosByProveedor(
  proveedor: string,
): Promise<Modelo[]> {
  const modelos = await loadModelos();
  return modelos.filter((m) => m.proveedor === proveedor);
}

/**
 * Filter models by category
 */
export async function filterModelosByCategoria(
  categoria: string,
): Promise<Modelo[]> {
  const modelos = await loadModelos();
  return modelos.filter((m) => m.categoria === categoria);
}

/**
 * Sort models by price (ascending)
 */
export function sortModelosByPrecio(
  modelos: Modelo[],
  type: "input" | "output" = "input",
): Modelo[] {
  return [...modelos].sort((a, b) => a.precio[type] - b.precio[type]);
}

/**
 * Sort models by benchmark score (descending)
 */
export function sortModelosByBenchmark(
  modelos: Modelo[],
  benchmarkType: string,
): Modelo[] {
  return [...modelos].sort((a, b) => {
    const scoreA =
      a.benchmarks.find((b) => b.tipo === benchmarkType)?.puntuacion ?? 0;
    const scoreB =
      b.benchmarks.find((b) => b.tipo === benchmarkType)?.puntuacion ?? 0;
    return scoreB - scoreA;
  });
}

/**
 * Calculate estimated cost for a scenario
 */
export function calcularCosteEstimado(
  modelo: Modelo,
  horasMes: number,
  tokensHora: number,
  ratioInputOutput: number = 3,
): CalculoCoste {
  const totalTokens = horasMes * tokensHora;
  const inputTokens = totalTokens * (ratioInputOutput / (ratioInputOutput + 1));
  const outputTokens = totalTokens * (1 / (ratioInputOutput + 1));

  const costeInput = (inputTokens / 1_000_000) * modelo.precio.input;
  const costeOutput = (outputTokens / 1_000_000) * modelo.precio.output;

  return {
    id: modelo.id,
    nombre: modelo.nombre,
    costeMensual: costeInput + costeOutput,
    desglose: {
      input: costeInput,
      output: costeOutput,
    },
    tokensEstimados: {
      input: Math.round(inputTokens),
      output: Math.round(outputTokens),
    },
  };
}

/**
 * Get best value model (performance/price ratio)
 */
export function getMejorValor(modelos: Modelo[]): Modelo | undefined {
  if (modelos.length === 0) return undefined;

  return modelos.reduce((best, current) => {
    const bestScore = calcularPuntuacionValor(best);
    const currentScore = calcularPuntuacionValor(current);
    return currentScore > bestScore ? current : best;
  });
}

/**
 * Calculate value score (performance/price)
 */
export function calcularPuntuacionValor(modelo: Modelo): number {
  const avgBenchmark =
    modelo.benchmarks.reduce((sum, b) => sum + b.puntuacion, 0) /
    modelo.benchmarks.length;
  const avgPrice = (modelo.precio.input + modelo.precio.output) / 2;
  return avgPrice > 0 ? avgBenchmark / avgPrice : 0;
}

/**
 * Format price for display
 */
export function formatearPrecio(
  precio: number,
  moneda: string = "USD",
): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(precio);
}

/**
 * Format number with locale
 */
export function formatearNumero(numero: number, decimales: number = 0): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(numero);
}

/**
 * Format percentage
 */
export function formatearPorcentaje(
  valor: number,
  decimales: number = 1,
): string {
  return `${formatearNumero(valor, decimales)}%`;
}
