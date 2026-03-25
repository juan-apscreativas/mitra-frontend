import { z } from 'zod'
import { passwordSchema } from '@/lib/validations'

export const createUserSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Correo inválido')
      .max(255, 'Máximo 255 caracteres'),
    password: passwordSchema,
    password_confirmation: z.string().min(8),
    phone: z.string().max(20, 'Máximo 20 caracteres').optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  email: z.string().min(1).email('Correo inválido').max(255, 'Máximo 255 caracteres'),
  phone: z.string().max(20, 'Máximo 20 caracteres').optional().nullable(),
  status: z.enum(['active', 'inactive', 'blocked']).optional(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
