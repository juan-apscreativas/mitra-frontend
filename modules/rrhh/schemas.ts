import { z } from 'zod'
import { passwordSchema } from '@/lib/validations'

// Area
export const createAreaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
})

export const updateAreaSchema = z.object({
  name: z.string().min(1).max(255),
  status: z.enum(['active', 'inactive']).optional(),
})

export type CreateAreaFormValues = z.infer<typeof createAreaSchema>
export type UpdateAreaFormValues = z.infer<typeof updateAreaSchema>

// Document
export const createDocumentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  description: z.string().max(1000).optional().nullable(),
  is_required_by_default: z.boolean(),
})

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  is_required_by_default: z.boolean(),
  status: z.enum(['active', 'inactive']).optional(),
})

export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>
export type UpdateDocumentFormValues = z.infer<typeof updateDocumentSchema>

// Position
export const positionDocumentSchema = z.object({
  document_id: z.string().min(1),
  is_required: z.boolean(),
})

export const createPositionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  area_id: z.string().min(1, 'El área es requerida'),
  authorized_positions: z.coerce.number().min(1, 'Debe ser al menos 1'),
  reports_to_id: z.string().nullable().optional(),
  documents: z.array(positionDocumentSchema).optional().default([]),
})

export const updatePositionSchema = z.object({
  name: z.string().min(1).max(255),
  area_id: z.string().min(1),
  authorized_positions: z.coerce.number().min(1),
  reports_to_id: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  documents: z.array(positionDocumentSchema).optional().default([]),
})

export type CreatePositionFormValues = z.infer<typeof createPositionSchema>
export type UpdatePositionFormValues = z.infer<typeof updatePositionSchema>

// Employee
export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  email: z.string().min(1, 'El correo es requerido').email('Correo inválido').max(255),
  password: passwordSchema,
  password_confirmation: z.string().min(8),
  position_id: z.string().min(1, 'El puesto es requerido'),
  hired_at: z.string().min(1, 'La fecha de ingreso es requerida'),
  location: z.string().max(255).optional().nullable(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
})

export const updateEmployeeSchema = z.object({
  name: z.string().min(1).max(255),
  position_id: z.string().min(1),
  hired_at: z.string().min(1),
  location: z.string().max(255).optional().nullable(),
})

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>
