'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useCreatePosition, useUpdatePosition } from '../hooks/use-positions'
import { useAreas } from '../hooks/use-areas'
import { usePositions } from '../hooks/use-positions'
import { useDocuments } from '../hooks/use-documents'
import { rrhhStatsKeys } from '../api/stats'
import {
  createPositionSchema,
  updatePositionSchema,
  type CreatePositionFormValues,
  type UpdatePositionFormValues,
} from '../schemas'
import type { PositionFormProps, AreaListParams, PositionListParams, DocumentListParams } from '../types'

type PositionFormValues = UpdatePositionFormValues

export function PositionForm({ defaultValues, positionId, mode, formId = 'position-form', onSuccess }: PositionFormProps) {
  const createPosition = useCreatePosition()
  const updatePosition = useUpdatePosition()
  const queryClient = useQueryClient()

  const isEdit = mode === 'edit'
  const schema = isEdit ? updatePositionSchema : createPositionSchema

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaultValues ?? {
      name: '',
      area_id: '',
      authorized_positions: 1,
      reports_to_id: null,
      documents: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'documents',
  })

  // Fetch active areas for select
  const { data: areasData } = useAreas({ per_page: 100, 'filter[status]': 'active' } as AreaListParams)
  const areas = areasData?.data ?? []

  // Fetch active positions for reports_to select (exclude self)
  const { data: positionsData } = usePositions({ per_page: 100, 'filter[status]': 'active' } as PositionListParams)
  const positions = (positionsData?.data ?? []).filter((p) => p.id !== positionId)

  // Fetch active documents for configuration
  const { data: documentsData } = useDocuments({ per_page: 100, 'filter[status]': 'active' } as DocumentListParams)
  const allDocuments = documentsData?.data ?? []

  function isDocumentSelected(documentId: string | number): boolean {
    const id = String(documentId)
    return fields.some((f) => f.document_id === id)
  }

  function toggleDocument(documentId: string | number, isRequired: boolean) {
    const id = String(documentId)
    const current = form.getValues('documents') ?? []
    const exists = current.find((d) => d.document_id === id)
    if (exists) {
      replace(current.filter((d) => d.document_id !== id))
    } else {
      replace([...current, { document_id: id, is_required: isRequired }])
    }
  }

  function setDocumentRequired(documentId: string | number, isRequired: boolean) {
    const id = String(documentId)
    const current = form.getValues('documents') ?? []
    replace(
      current.map((d) =>
        d.document_id === id ? { ...d, is_required: isRequired } : d
      )
    )
  }

  async function onSubmit(values: PositionFormValues) {
    try {
      if (isEdit && positionId) {
        await updatePosition.mutateAsync({ id: positionId, data: values })
        toast.success(labels.rrhh.positions.updated)
      } else {
        await createPosition.mutateAsync(values as CreatePositionFormValues)
        toast.success(labels.rrhh.positions.created)
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
                <FormLabel>{labels.rrhh.positions.fields.name}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="area_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.positions.fields.area}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="">{labels.rrhh.positions.selectArea}</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorized_positions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.positions.fields.authorizedPositions}</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reports_to_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.rrhh.positions.fields.reportsTo}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  >
                    <option value="">{labels.rrhh.positions.noReportsTo}</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name} — {pos.area_name}
                      </option>
                    ))}
                  </select>
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
                  <FormLabel>{labels.rrhh.positions.fields.status}</FormLabel>
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

          {/* Document configuration section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-medium">{labels.rrhh.positions.documentsSection.title}</h3>
            {allDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">{labels.rrhh.positions.documentsSection.noDocuments}</p>
            ) : (
              <div className="space-y-2">
                {allDocuments.map((doc) => {
                  const docId = String(doc.id)
                  const selected = isDocumentSelected(docId)
                  const currentDoc = fields.find((f) => f.document_id === docId)
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-input p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() =>
                            toggleDocument(docId, doc.is_required_by_default)
                          }
                        />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      {selected && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {currentDoc?.is_required
                              ? labels.rrhh.positions.documentsSection.required
                              : labels.rrhh.positions.documentsSection.optional}
                          </span>
                          <Switch
                            size="sm"
                            checked={currentDoc?.is_required ?? false}
                            onCheckedChange={(checked) =>
                              setDocumentRequired(docId, checked)
                            }
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </form>
      </FormDrawerBody>
      <FormDrawerSubmitFooter formId={formId} />
    </Form>
  )
}
