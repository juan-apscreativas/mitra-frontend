import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres').nullable().optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>

export const duplicateRoleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
})

export type DuplicateRoleFormValues = z.infer<typeof duplicateRoleSchema>
