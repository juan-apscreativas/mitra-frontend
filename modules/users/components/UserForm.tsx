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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormDrawerBody, FormDrawerSubmitFooter } from '@/components/ui/form-drawer'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useCreateUser, useUpdateUser } from '../hooks'
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from '../schemas'
import type { UserFormProps } from '../types'

export function UserForm({ defaultValues, userId, mode, formId = 'user-form', onSuccess }: UserFormProps) {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const isEdit = mode === 'edit'
  const schema = isEdit ? updateUserSchema : createUserSchema

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      name: '',
      email: '',
      ...(!isEdit ? { password: '', password_confirmation: '' } : {}),
    },
  })

  async function onSubmit(values: CreateUserFormValues | UpdateUserFormValues) {
    try {
      if (isEdit && userId) {
        await updateUser.mutateAsync({ id: userId, data: values as UpdateUserFormValues })
        toast.success(labels.users.updated)
      } else {
        await createUser.mutateAsync(values as CreateUserFormValues)
        toast.success(labels.users.created)
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
                <FormLabel>{labels.users.fields.name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.users.fields.email}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'phone' as never}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.users.fields.phone}</FormLabel>
                <FormControl>
                  <Input {...field} value={(field.value as string) ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEdit && (
            <>
              <FormField
                control={form.control}
                name={'password' as never}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.users.fields.password}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'password_confirmation' as never}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.users.fields.passwordConfirmation}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {isEdit && (
            <FormField
              control={form.control}
              name={'status' as never}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.users.fields.status}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value as string}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">{labels.users.statuses.active}</SelectItem>
                      <SelectItem value="inactive">{labels.users.statuses.inactive}</SelectItem>
                      <SelectItem value="blocked">{labels.users.statuses.blocked}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </FormDrawerBody>
      <FormDrawerSubmitFooter formId={formId} />
    </Form>
  )
}
