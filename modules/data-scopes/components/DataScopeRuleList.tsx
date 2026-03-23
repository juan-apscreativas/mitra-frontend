'use client'

import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useTableParams } from '@/lib/use-table-params'
import { useDataScopeRules, useScopeableEntities } from '../hooks'
import { columns } from './columns'
import type { DataScopeRuleListParams } from '../types'

export function DataScopeRuleList() {
  const {
    sorting,
    columnFilters,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  } = useTableParams({ defaultSort: 'name' })

  const { data, isLoading, error, refetch } = useDataScopeRules(
    apiParams as DataScopeRuleListParams
  )
  const { data: entitiesData } = useScopeableEntities()

  const filterOptions: Record<string, { label: string; value: string }[]> = {
    entity: (entitiesData?.data ?? []).map((e) => ({
      label: e.label,
      value: e.entity,
    })),
    type: [
      { label: labels.dataScopes.types.own, value: 'own' },
      { label: labels.dataScopes.types.relation, value: 'relation' },
      { label: labels.dataScopes.types.field_value, value: 'field_value' },
      { label: labels.dataScopes.types.all, value: 'all' },
      { label: labels.dataScopes.types.custom, value: 'custom' },
    ],
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length && Object.keys(columnFilters).length === 0 ? (
        <EmptyState message={labels.dataScopes.empty} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pagination={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          columnFilters={columnFilters}
          onColumnFilterChange={onColumnFilterChange}
          filterOptions={filterOptions}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      )}
    </div>
  )
}
