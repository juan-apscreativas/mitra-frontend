'use client'

import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useTableParams } from '@/lib/use-table-params'
import { usePositions } from '../hooks/use-positions'
import { useAreas } from '../hooks/use-areas'
import { positionColumns } from './position-columns'
import type { PositionListParams, AreaListParams } from '../types'

interface PositionListProps {
  onEdit?: (id: string) => void
}

export function PositionList({ onEdit }: PositionListProps) {
  const {
    sorting,
    columnFilters,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  } = useTableParams({ defaultSort: '-created_at' })

  const { data, isLoading, error, refetch } = usePositions(apiParams as PositionListParams)
  const { data: areasData } = useAreas({ per_page: 100, 'filter[status]': 'active' } as AreaListParams)

  const filterOptions: Record<string, { label: string; value: string }[]> = {
    status: [
      { label: labels.rrhh.statuses.active, value: 'active' },
      { label: labels.rrhh.statuses.inactive, value: 'inactive' },
    ],
    area_id: (areasData?.data ?? []).map((a) => ({ label: a.name, value: String(a.id) })),
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length && Object.keys(columnFilters).length === 0 ? (
        <EmptyState message={labels.rrhh.positions.empty} />
      ) : (
        <DataTable
          columns={positionColumns}
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
