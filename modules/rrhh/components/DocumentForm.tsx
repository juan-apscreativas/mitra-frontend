'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
import { useCreateDocument, useUpdateDocument } from '../hooks/use-documents'
import { rrhhStatsKeys } from '../api/stats'
import {
  createDocumentSchema,
  updateDocumentSchema,
  type CreateDocumentFormValues,
  type UpdateDocumentFormValues,
} from '../schemas'
import type { DocumentFormProps } from '../types'

type DocumentFormValues = UpdateDocumentFormValues

export function DocumentForm({ defaultValues, documentId, mode, formId = 'document-form', onSuccess }: DocumentFormProps) {
  const createDocument = useCreateDocument()
  const updateDocument = useUpdateDocument()
  const queryClient = useQueryClient()

  const isEdit = mode === 'edit'
  const schema = isEdit ? updateDocumentSchema : createDocumentSchema

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaultValues ?? {
      name: '',
      description: '',
      is_required_by_default: false,
    },
  })

  async function onSubmit(values: DocumentFormValues) {
    try {
      if (isEdit && documentId) {
        await updateDocument.mutateAsync({ id: documentId, data: values })
        toast.success(labels.rrhh.documents.updated)
      } else {
        await createDocument.mutateAsync(values as CreateDocumentFormValues)
        toast.success(labels.rrhh.documents.created)
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
                <FormLabel>{labels.rrhh.documents.fields.name}</FormLabel>
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
                <FormLabel>{labels.rrhh.documents.fields.description}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_required_by_default"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">{labels.rrhh.documents.fields.isRequiredByDefault}</FormLabel>
                </div>
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
                  <FormLabel>{labels.rrhh.documents.fields.status}</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value ?? ''}
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
