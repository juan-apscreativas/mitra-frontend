'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FormDrawerBody, FormDrawerSubmitFooter } from '@/components/ui/form-drawer'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useChangePassword } from '../hooks'
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas'

interface ChangePasswordFormProps {
  formId?: string
  onSuccess?: () => void
}

export function ChangePasswordForm({ formId = 'change-password-form', onSuccess }: ChangePasswordFormProps) {
  const changePassword = useChangePassword()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: '', password: '', password_confirmation: '' },
  })

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword.mutateAsync(values)
      toast.success(labels.auth.passwordChanged)
      form.reset()
      onSuccess?.()
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  return (
    <Form {...form}>
      <FormDrawerBody>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.auth.currentPassword}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.auth.newPassword}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.auth.confirmPassword}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </FormDrawerBody>
      <FormDrawerSubmitFooter formId={formId} submitLabel={labels.auth.changePassword} />
    </Form>
  )
}
