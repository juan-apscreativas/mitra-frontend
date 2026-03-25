import { z } from 'zod'

export const dataScopeRuleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  entity: z.string().min(1, 'La entidad es requerida'),
  entity_label: z
    .string()
    .min(1, 'La etiqueta de entidad es requerida')
    .max(255, 'Máximo 255 caracteres'),
  type: z.enum(['own', 'relation', 'field_value', 'all', 'custom']),
  configuration: z.record(z.string(), z.unknown()),
  description: z.string().max(1000, 'Máximo 1000 caracteres').nullable().optional(),
})

export type DataScopeRuleFormValues = z.infer<typeof dataScopeRuleSchema>
