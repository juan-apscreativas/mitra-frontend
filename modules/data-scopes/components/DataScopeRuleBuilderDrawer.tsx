'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useDataScopeRule } from '../hooks'
import { DataScopeRuleBuilder } from './DataScopeRuleBuilder'

interface DataScopeRuleBuilderDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  ruleId?: string
}

export function DataScopeRuleBuilderDrawer({
  open,
  onOpenChange,
  mode,
  ruleId,
}: DataScopeRuleBuilderDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = useDataScopeRule(ruleId ?? '', {
    enabled: isEdit && !!ruleId && open,
  })
  const rule = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${rule?.name ?? ''}`
    : labels.dataScopes.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${ruleId}`} open={open} onOpenChange={onOpenChange} size="xl">
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <DataScopeRuleBuilder
            mode={mode}
            ruleId={ruleId}
            defaultValues={
              isEdit && rule
                ? {
                    name: rule.name,
                    entity: rule.entity,
                    entity_label: rule.entity_label,
                    type: rule.type,
                    configuration: rule.configuration,
                    description: rule.description,
                  }
                : undefined
            }
            onSuccess={handleSuccess}
          />
        )}
      </FormDrawerContent>
    </FormDrawer>
  )
}
