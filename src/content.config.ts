import { defineCollection, z } from 'astro:content';

const modelos = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    proveedor: z.string(),
    categoria: z.enum(['flagship', 'standard', 'economic', 'specialized']),
    contexto: z.number(),
    precio: z.object({
      input: z.number(),
      output: z.number(),
      moneda: z.string().optional()
    }),
    caracteristicas: z.array(z.string()).optional(),
    disponibleEn: z.array(z.string()).optional(),
    descripcion: z.string().optional(),
    lanzamiento: z.string().optional(),
    benchmarks: z.record(z.string(), z.number()).optional()
  })
});

const plataformas = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    url: z.string(),
    descripcion: z.string().optional(),
    modelos: z.array(z.string()).optional(),
    precios: z.record(z.string(), z.object({
      input: z.number(),
      output: z.number()
    })).optional()
  })
});

const benchmarks = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    categoria: z.string(),
    resultados: z.record(z.string(), z.number())
  })
});

const recomendaciones = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    titulo: z.string(),
    escenario: z.string(),
    descripcion: z.string(),
    modelosRecomendados: z.array(z.object({
      id: z.string(),
      razon: z.string()
    })),
    criterios: z.object({
      presupuesto: z.enum(['bajo', 'medio', 'alto']).optional(),
      uso: z.string().optional(),
      volumen: z.enum(['bajo', 'medio', 'alto']).optional()
    }).optional()
  })
});

export const collections = {
  modelos,
  plataformas,
  benchmarks,
  recomendaciones
};