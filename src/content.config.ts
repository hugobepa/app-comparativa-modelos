/**
 * Content collections configuration for Astro 6
 * @module content.config
 */

import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

/** Modelos collection - LLM models data */
const modelos = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/modelos" }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    proveedor: z.enum([
      "anthropic",
      "openai",
      "google",
      "deepseek",
      "meta",
      "mistral",
      "xai",
    ]),
    categoria: z.enum(["flagship", "standard", "economic", "specialized"]),
    precio: z.object({
      input: z.number(),
      output: z.number(),
      moneda: z.string().default("USD"),
    }),
    contexto: z.number(),
    benchmarks: z
      .object({
        sweBenchVerified: z.number().optional(),
        humaneval: z.number().optional(),
        mmlu: z.number().optional(),
        gpqa: z.number().optional(),
      })
      .optional(),
    caracteristicas: z.array(z.string()).optional(),
    disponibleEn: z.array(z.string()),
    lanzamiento: z.string().optional(),
  }),
});

/** Plataformas collection - Platform data */
const plataformas = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/plataformas" }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    tipo: z.enum(["copilot", "aggregator", "standalone"]),
    descripcion: z.string(),
    planes: z.array(
      z.object({
        id: z.string(),
        nombre: z.string(),
        precioMensual: z.number(),
        precioAnual: z.number().optional(),
        tipo: z.enum(["free", "pro", "pro-plus", "business", "enterprise"]),
        caracteristicas: z.array(z.string()),
        limites: z
          .object({
            peticionesDia: z.number().optional(),
            modelosDisponibles: z.number().optional(),
          })
          .optional(),
      }),
    ),
    modelos: z.array(z.string()),
    url: z.string().url(),
  }),
});

/** Escenarios collection - Usage scenarios */
const escenarios = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/escenarios" }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    perfil: z.enum(["casual", "profesional", "enterprise"]),
    usoMensual: z.object({
      peticiones: z.number(),
      tokensInput: z.number(),
      tokensOutput: z.number(),
    }),
    prioridades: z.array(
      z.enum(["precio", "rendimiento", "velocidad", "contexto"]),
    ),
    presupuesto: z.number().optional(),
  }),
});

/** Recomendaciones collection - Recommendations */
const recomendaciones = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/recomendaciones" }),
  schema: z.object({
    id: z.string(),
    perfil: z.enum(["casual", "profesional", "enterprise"]),
    titulo: z.string(),
    descripcion: z.string(),
    recomendado: z.string(),
    razon: z.string(),
    alternativas: z.array(z.string()),
    ahorroEstimado: z.number().optional(),
    prioridad: z.number().min(1).max(5),
    escenarios: z.array(z.string()),
  }),
});

/** Benchmarks collection - Benchmark data */
const benchmarks = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/benchmarks" }),
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    fuente: z.string(),
    url: z.string().url().optional(),
    resultados: z.array(
      z.object({
        modeloId: z.string(),
        puntuacion: z.number(),
        fecha: z.string(),
      }),
    ),
  }),
});

export const collections = {
  modelos,
  plataformas,
  escenarios,
  recomendaciones,
  benchmarks,
};
