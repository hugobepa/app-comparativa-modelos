/**
 * Comparison and calculation utilities
 * @module utils/comparativa
 */

import type { EscenarioUso, PerfilUso } from "@interfaces/escenarios";
import type { ComparacionModelo, Modelo } from "@interfaces/modelos";
import type {
  ComparacionPlataforma,
  Plataforma,
} from "@interfaces/plataformas";
import { calcularCosteEstimado, calcularPuntuacionValor } from "./json-db";

/**
 * Compare multiple models
 */
export function compararModelos(
  modelos: Modelo[],
  horasMes: number,
  tokensHora: number,
): ComparacionModelo[] {
  return modelos.map((modelo) => {
    const calculo = calcularCosteEstimado(modelo, horasMes, tokensHora);
    const puntuacionRendimiento = calcularPuntuacionRendimiento(modelo);
    const puntuacionValor = calcularPuntuacionValor(modelo);

    return {
      modelo,
      costeEstimado: calculo.costeMensual,
      puntuacionRendimiento,
      puntuacionValor,
    };
  });
}

/**
 * Calculate performance score (0-100)
 */
export function calcularPuntuacionRendimiento(modelo: Modelo): number {
  if (modelo.benchmarks.length === 0) return 0;

  const avgScore =
    modelo.benchmarks.reduce((sum, b) => sum + b.puntuacion, 0) /
    modelo.benchmarks.length;

  return Math.round(avgScore);
}

/**
 * Compare platforms for a scenario
 */
export function compararPlataformas(
  plataformas: Plataforma[],
  escenario: EscenarioUso,
  modelos: Modelo[],
): ComparacionPlataforma[] {
  return plataformas.map((plataforma) => {
    const costeMensual = calcularCostePlataforma(
      plataforma,
      escenario,
      modelos,
    );
    const puntuacionValor = calcularValorPlataforma(plataforma, modelos);
    const perfilesRecomendados = determinarPerfilesRecomendados(plataforma);

    return {
      plataforma,
      costeMensual,
      puntuacionValor,
      perfilesRecomendados,
    };
  });
}

/**
 * Calculate platform monthly cost
 */
function calcularCostePlataforma(
  plataforma: Plataforma,
  escenario: EscenarioUso,
  modelos: Modelo[],
): number {
  // Get cheapest available model for calculation
  const modelosDisponibles = modelos.filter((m) =>
    plataforma.modelosDisponibles.includes(m.id),
  );

  if (modelosDisponibles.length === 0) return 0;

  const modeloMasBarato = modelosDisponibles.reduce((cheapest, current) =>
    current.precio.input < cheapest.precio.input ? current : cheapest,
  );

  const calculo = calcularCosteEstimado(
    modeloMasBarato,
    escenario.horasMes,
    escenario.tokensHora,
  );

  // Add subscription cost if applicable
  const planMasBarato = plataforma.planes.reduce((cheapest, current) =>
    current.precioMensual < cheapest.precioMensual ? current : cheapest,
  );

  return calculo.costeMensual + planMasBarato.precioMensual;
}

/**
 * Calculate platform value score
 */
function calcularValorPlataforma(
  plataforma: Plataforma,
  modelos: Modelo[],
): number {
  const modelosDisponibles = modelos.filter((m) =>
    plataforma.modelosDisponibles.includes(m.id),
  );

  if (modelosDisponibles.length === 0) return 0;

  const avgValue =
    modelosDisponibles.reduce((sum, m) => sum + calcularPuntuacionValor(m), 0) /
    modelosDisponibles.length;

  return Math.round(avgValue * 100) / 100;
}

/**
 * Determine recommended profiles for a platform
 */
function determinarPerfilesRecomendados(plataforma: Plataforma): string[] {
  const perfiles: string[] = [];

  const tienePlanFree = plataforma.planes.some((p) => p.tipo === "free");
  const tienePlanPro = plataforma.planes.some((p) => p.tipo === "pro");
  const tienePlanEnterprise = plataforma.planes.some(
    (p) => p.tipo === "enterprise",
  );

  if (tienePlanFree) perfiles.push("casual");
  if (tienePlanPro) perfiles.push("profesional");
  if (tienePlanEnterprise) perfiles.push("enterprise");

  return perfiles;
}

/**
 * Get top N models by criteria
 */
export function getTopModelos(
  modelos: Modelo[],
  criterio: "precio" | "rendimiento" | "valor",
  n: number = 5,
): Modelo[] {
  const sorted = [...modelos].sort((a, b) => {
    switch (criterio) {
      case "precio":
        return a.precio.input - b.precio.input;
      case "rendimiento":
        return (
          calcularPuntuacionRendimiento(b) - calcularPuntuacionRendimiento(a)
        );
      case "valor":
        return calcularPuntuacionValor(b) - calcularPuntuacionValor(a);
      default:
        return 0;
    }
  });

  return sorted.slice(0, n);
}

/**
 * Calculate savings percentage
 */
export function calcularAhorro(
  costeOriginal: number,
  costeNuevo: number,
): number {
  if (costeOriginal === 0) return 0;
  return ((costeOriginal - costeNuevo) / costeOriginal) * 100;
}

/**
 * Get recommendation for profile
 */
export function getRecomendacionPorPerfil(
  perfil: PerfilUso,
  comparaciones: ComparacionModelo[],
): ComparacionModelo | undefined {
  if (comparaciones.length === 0) return undefined;

  switch (perfil) {
    case "casual":
      // Best value for low usage
      return comparaciones.reduce((best, current) =>
        current.costeEstimado < best.costeEstimado ? current : best,
      );
    case "profesional":
      // Best balance of performance and cost
      return comparaciones.reduce((best, current) => {
        const bestScore = best.puntuacionRendimiento / best.costeEstimado;
        const currentScore =
          current.puntuacionRendimiento / current.costeEstimado;
        return currentScore > bestScore ? current : best;
      });
    case "enterprise":
      // Best performance regardless of cost
      return comparaciones.reduce((best, current) =>
        current.puntuacionRendimiento > best.puntuacionRendimiento
          ? current
          : best,
      );
    default:
      return comparaciones[0];
  }
}
