'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerBody,
  FormDrawerFooter,
} from '@/components/ui/form-drawer'
import { DetailSection, DetailField } from '@/components/ui/detail-section'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import { useDataScopeRule } from '../hooks'
import { DataScopeRuleBuilderDrawer } from './DataScopeRuleBuilderDrawer'

interface DataScopeRuleViewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruleId: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DataScopeRuleViewDrawer({ open, onOpenChange, ruleId }: DataScopeRuleViewDrawerProps) {
  const { data, isLoading, isError, error, refetch } = useDataScopeRule(ruleId, {
    enabled: !!ruleId && open,
  })
  const rule = data?.data
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <FormDrawer open={open} onOpenChange={onOpenChange} key={ruleId}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <div className="flex items-center gap-2">
              <FormDrawerTitle>{rule?.name ?? ''}</FormDrawerTitle>
              {rule && (
                <Badge variant="secondary">
                  {labels.dataScopes.types[rule.type]}
                </Badge>
              )}
            </div>
          </FormDrawerHeader>

          {isError ? (
            <FormDrawerBody>
              <ErrorState error={error} onRetry={refetch} />
            </FormDrawerBody>
          ) : isLoading || !rule ? (
            <FormDrawerBody>
              <LoadingState />
            </FormDrawerBody>
          ) : (
            <FormDrawerBody className="space-y-6">
              <DetailSection title={labels.dataScopes.sections.rule}>
                <DetailField
                  label={labels.dataScopes.fields.entity}
                  value={rule.entity_label}
                />
                <DetailField
                  label={labels.dataScopes.fields.type}
                  value={labels.dataScopes.types[rule.type]}
                />
                <DetailField
                  label={labels.dataScopes.fields.description}
                  value={rule.description}
                />
              </DetailSection>

              <DetailSection title={labels.dataScopes.sections.configuration}>
                {Object.keys(rule.configuration).length > 0 ? (
                  Object.entries(rule.configuration).map(([key, value]) => (
                    <DetailField
                      key={key}
                      label={labels.dataScopes.configLabels[key as keyof typeof labels.dataScopes.configLabels] ?? key}
                      value={String(value ?? '—')}
                    />
                  ))
                ) : (
                  <p className="py-2 text-sm text-muted-foreground">—</p>
                )}
              </DetailSection>

              <DetailSection title={labels.dataScopes.sections.info}>
                <DetailField
                  label={labels.common.createdAt}
                  value={formatDate(rule.created_at)}
                />
              </DetailSection>
            </FormDrawerBody>
          )}

          <FormDrawerFooter className="justify-center">
            <Authorized permission="data_scopes.update">
              <Button
                className="w-full"
                onClick={() => {
                  onOpenChange(false)
                  setTimeout(() => setEditOpen(true), 220)
                }}
              >
                <Pencil className="h-4 w-4" />
                {labels.common.edit}
              </Button>
            </Authorized>
          </FormDrawerFooter>
        </FormDrawerContent>
      </FormDrawer>

      <DataScopeRuleBuilderDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        ruleId={ruleId}
      />
    </>
  )
}
