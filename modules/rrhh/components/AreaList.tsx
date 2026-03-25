'use client'

import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useTableParams } from '@/lib/use-table-params'
import { useAreas } from '../hooks/use-areas'
import { areaColumns } from './area-columns'
import type { AreaListParams } from '../types'

interface AreaListProps {
  onEdit?: (id: string) => void
}

export function AreaList({ onEdit }: AreaListProps) {
  const {
    sorting,
    columnFilters,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  } = useTableParams({ defaultSort: '-created_at' })

  const { data, isLoading, error, refetch } = useAreas(apiParams as AreaListParams)

  const filterOptions: Record<string, { label: string; value: string }[]> = {
    status: [
      { label: labels.rrhh.statuses.active, value: 'active' },
      { label: labels.rrhh.statuses.inactive, value: 'inactive' },
    ],
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length && Object.keys(columnFilters).length === 0 ? (
        <EmptyState message={labels.rrhh.areas.empty} />
      ) : (
        <DataTable
          columns={areaColumns}
          data={data?.data ?? []}
          pagination={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          columnFilters={columnFilters}
          onColumnFilterChange={onColumnFilterChange}
          filterOptions={filterOptions}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          meta={{ onEdit }}
        />
      )}
    </div>
  )
}
