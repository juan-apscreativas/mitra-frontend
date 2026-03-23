'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  FormDrawerBody,
  FormDrawerFooter,
  FormDrawerClose,
} from '@/components/ui/form-drawer'
import { cn } from '@/lib/utils'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useCreateDataScopeRule, useUpdateDataScopeRule, useScopeableEntities } from '../hooks'
import { dataScopeRuleSchema, type DataScopeRuleFormValues } from '../schemas'
import { ScopeRulePreview } from './ScopeRulePreview'
import type { DataScopeFormProps, DataScopeRuleType } from '../types'

const RULE_TYPES: DataScopeRuleType[] = ['own', 'relation', 'field_value', 'all', 'custom']

const OPERATORS = ['=', '!=', '<', '<=', '>', '>=', 'in', 'not_in', 'like']

export function DataScopeRuleBuilder({
  defaultValues,
  ruleId,
  mode,
  formId = 'data-scope-rule-form',
  onSuccess,
}: DataScopeFormProps) {
  const createRule = useCreateDataScopeRule()
  const updateRule = useUpdateDataScopeRule()
  const { data: entitiesData } = useScopeableEntities()

  const form = useForm<DataScopeRuleFormValues>({
    resolver: zodResolver(dataScopeRuleSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      entity: defaultValues?.entity ?? '',
      entity_label: defaultValues?.entity_label ?? '',
      type: defaultValues?.type ?? 'own',
      configuration: defaultValues?.configuration ?? {},
      description: defaultValues?.description ?? '',
    },
  })

  const watchedType = useWatch({ control: form.control, name: 'type' })
  const watchedEntity = useWatch({ control: form.control, name: 'entity' })
  const watchedConfiguration = useWatch({ control: form.control, name: 'configuration' })

  function handleEntityChange(entityClass: string | null) {
    if (!entityClass) return
    const entity = entitiesData?.data.find((e) => e.entity === entityClass)
    form.setValue('entity', entityClass)
    form.setValue('entity_label', entity?.label ?? '')
  }

  function handleTypeChange(type: DataScopeRuleType) {
    form.setValue('type', type)
    // Reset configuration when type changes
    switch (type) {
      case 'own':
        form.setValue('configuration', { owner_column: 'created_by' })
        break
      case 'relation':
        form.setValue('configuration', {
          pivot_table: '',
          entity_foreign_key: '',
          user_foreign_key: 'user_id',
        })
        break
      case 'field_value':
        form.setValue('configuration', { column: '', operator: '=', value: '' })
        break
      case 'all':
      case 'custom':
        form.setValue('configuration', {})
        break
    }
  }

  function setConfigField(key: string, value: string) {
    const current = form.getValues('configuration') ?? {}
    form.setValue('configuration', { ...current, [key]: value })
  }

  async function onSubmit(values: DataScopeRuleFormValues) {
    try {
      if (mode === 'edit' && ruleId) {
        await updateRule.mutateAsync({
          id: ruleId,
          data: {
            name: values.name,
            configuration: values.configuration,
            description: values.description ?? null,
          },
        })
        toast.success(labels.dataScopes.updated)
      } else {
        await createRule.mutateAsync({
          name: values.name,
          entity: values.entity,
          entity_label: values.entity_label,
          type: values.type,
          configuration: values.configuration,
          description: values.description ?? undefined,
        })
        toast.success(labels.dataScopes.created)
      }
      onSuccess?.()
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  const isPending = createRule.isPending || updateRule.isPending
  const config = watchedConfiguration ?? {}

  return (
    <Form {...form}>
      <FormDrawerBody>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Name + Description */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">1. {labels.dataScopes.fields.name}</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.dataScopes.fields.name}</FormLabel>
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
                  <FormLabel>{labels.dataScopes.fields.description}</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Step 2: Entity selection */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">2. {labels.dataScopes.fields.entity}</h3>
            <FormField
              control={form.control}
              name="entity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.dataScopes.selectEntity}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleEntityChange}
                    disabled={mode === 'edit'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={labels.dataScopes.selectEntity} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entitiesData?.data.map((entity, index) => (
                        <SelectItem key={`entity-${index}`} value={entity.entity}>
                          {entity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Step 3: Rule type selection */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">3. {labels.dataScopes.fields.type}</h3>
            <FormField
              control={form.control}
              name="type"
              render={() => (
                <FormItem>
                  <FormLabel>{labels.dataScopes.selectType}</FormLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {RULE_TYPES.map((ruleType) => (
                      <button
                        key={ruleType}
                        type="button"
                        disabled={mode === 'edit'}
                        onClick={() => handleTypeChange(ruleType)}
                        className={cn(
                          'rounded-lg border p-3 text-left transition-colors',
                          watchedType === ruleType
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-muted-foreground/50',
                          mode === 'edit' && 'opacity-60 cursor-not-allowed'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {labels.dataScopes.types[ruleType]}
                          </span>
                          {watchedType === ruleType && (
                            <Badge variant="default" className="text-xs">
                              {labels.common.selected}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {labels.dataScopes.typeDescriptions[ruleType]}
                        </p>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Step 4: Type-specific configuration */}
          {watchedType && watchedType !== 'all' && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">4. {labels.dataScopes.fields.configuration}</h3>

              {watchedType === 'own' && (
                <FormItem>
                  <FormLabel>{labels.dataScopes.configLabels.ownerColumn}</FormLabel>
                  <FormControl>
                    <Input
                      value={String(config.owner_column ?? 'created_by')}
                      onChange={(e) => setConfigField('owner_column', e.target.value)}
                      placeholder="created_by"
                    />
                  </FormControl>
                </FormItem>
              )}

              {watchedType === 'relation' && (
                <>
                  <FormItem>
                    <FormLabel>{labels.dataScopes.configLabels.pivotTable}</FormLabel>
                    <FormControl>
                      <Input
                        value={String(config.pivot_table ?? '')}
                        onChange={(e) => setConfigField('pivot_table', e.target.value)}
                        placeholder="user_orders"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>{labels.dataScopes.configLabels.entityForeignKey}</FormLabel>
                    <FormControl>
                      <Input
                        value={String(config.entity_foreign_key ?? '')}
                        onChange={(e) => setConfigField('entity_foreign_key', e.target.value)}
                        placeholder="order_id"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>{labels.dataScopes.configLabels.userForeignKey}</FormLabel>
                    <FormControl>
                      <Input
                        value={String(config.user_foreign_key ?? 'user_id')}
                        onChange={(e) => setConfigField('user_foreign_key', e.target.value)}
                        placeholder="user_id"
                      />
                    </FormControl>
                  </FormItem>
                </>
              )}

              {watchedType === 'field_value' && (
                <>
                  <FormItem>
                    <FormLabel>{labels.dataScopes.configLabels.column}</FormLabel>
                    <FormControl>
                      <Input
                        value={String(config.column ?? '')}
                        onChange={(e) => setConfigField('column', e.target.value)}
                        placeholder="status"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>{labels.dataScopes.configLabels.operator}</FormLabel>
                    <Select
                      value={String(config.operator ?? '=')}
                      onValueChange={(v) => { if (v) setConfigField('operator', v) }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATORS.map((op, index) => (
                          <SelectItem key={`op-${index}`} value={op}>
                            {op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <FormLabel>{labels.dataScopes.configLabels.value}</FormLabel>
                    <FormControl>
                      <Input
                        value={String(config.value ?? '')}
                        onChange={(e) => setConfigField('value', e.target.value)}
                        placeholder="active"
                      />
                    </FormControl>
                  </FormItem>
                </>
              )}

              {watchedType === 'custom' && (
                <FormItem>
                  <FormLabel>{labels.dataScopes.configLabels.scopeClass}</FormLabel>
                  <FormControl>
                    <Input
                      value={String(config.scope_class ?? '')}
                      onChange={(e) => setConfigField('scope_class', e.target.value)}
                      placeholder="App\\Scopes\\MyCustomScope"
                    />
                  </FormControl>
                </FormItem>
              )}
            </div>
          )}

          {/* Step 5: Preview */}
          {watchedEntity && watchedType && (
            <ScopeRulePreview
              entity={watchedEntity}
              type={watchedType}
              configuration={config}
            />
          )}
        </form>
      </FormDrawerBody>
      <FormDrawerFooter>
        <FormDrawerClose render={<Button variant="outline" type="button" />}>
          {labels.common.cancel}
        </FormDrawerClose>
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending ? labels.common.loading : labels.common.save}
        </Button>
      </FormDrawerFooter>
    </Form>
  )
}
