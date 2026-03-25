import { z } from 'zod'
import { labels } from '@/lib/labels'
import { passwordSchema } from '@/lib/validations'

export const loginSchema = z.object({
  email: z.string().min(1, labels.auth.email).email(),
  password: z.string().min(1, labels.auth.password),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, labels.auth.email).email(),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    email: z.string().email(),
    password: passwordSchema,
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'La contraseña actual es requerida'),
    password: passwordSchema,
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
