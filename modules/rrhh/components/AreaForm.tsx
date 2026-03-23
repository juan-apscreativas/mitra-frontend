'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
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
import { useCreateArea, useUpdateArea } from '../hooks/use-areas'
import { rrhhStatsKeys } from '../api/stats'
import {
  createAreaSchema,
  updateAreaSchema,
  type CreateAreaFormValues,
  type UpdateAreaFormValues,
} from '../schemas'
import type { AreaFormProps } from '../types'

type AreaFormValues = UpdateAreaFormValues

export function AreaForm({ defaultValues, areaId, mode, formId = 'area-form', onSuccess }: AreaFormProps) {
  const createArea = useCreateArea()
  const updateArea = useUpdateArea()
  const queryClient = useQueryClient()

  const isEdit = mode === 'edit'
  const schema = isEdit ? updateAreaSchema : createAreaSchema

  const form = useForm<AreaFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaultValues ?? {
      name: '',
      max_positions: 1,
    },
  })

  async function onSubmit(values: AreaFormValues) {
    try {
      if (isEdit && areaId) {
        await updateArea.mutateAsync({ id: areaId, data: values })
        toast.success(labels.rrhh.areas.updated)
      } else {
        await createArea.mutateAsync(values as CreateAreaFormValues)
        toast.success(labels.rrhh.areas.created)
      }
      await queryClient.invalidateQueries({ queryKey: rrhhStatsKeys.all })
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
                <FormLabel>{labels.rrhh.areas.fields.name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_positions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.areas.fields.maxPositions}</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEdit && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.rrhh.areas.fields.status}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value as string}
                      onChange={field.onChange}
                    >
                      <option value="active">{labels.rrhh.statuses.active}</option>
                      <option value="inactive">{labels.rrhh.statuses.inactive}</option>
                    </select>
                  </FormControl>
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
