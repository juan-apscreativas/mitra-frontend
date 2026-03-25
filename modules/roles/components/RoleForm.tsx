'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { useCreateRole, useUpdateRole } from '../hooks'
import { roleSchema, type RoleFormValues } from '../schemas'
import type { RoleFormProps } from '../types'

export function RoleForm({ defaultValues, roleId, mode, formId = 'role-form', onSuccess }: RoleFormProps) {
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: defaultValues ?? { name: '', description: '' },
  })

  async function onSubmit(values: RoleFormValues) {
    try {
      if (mode === 'edit' && roleId) {
        await updateRole.mutateAsync({
          id: roleId,
          data: { ...values, description: values.description ?? null },
        })
        toast.success(labels.roles.updated)
      } else {
        await createRole.mutateAsync({
          name: values.name,
          description: values.description ?? undefined,
        })
        toast.success(labels.roles.created)
      }
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.roles.fields.name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.roles.fields.description}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </FormDrawerBody>
      <FormDrawerSubmitFooter formId={formId} />
    </Form>
  )
}
