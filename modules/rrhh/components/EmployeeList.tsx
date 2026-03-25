'use client'

import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useTableParams } from '@/lib/use-table-params'
import { useEmployees } from '../hooks/use-employees'
import { usePositions } from '../hooks/use-positions'
import { employeeColumns } from './employee-columns'
import type { EmployeeListParams, PositionListParams } from '../types'

interface EmployeeListProps {
  onEdit?: (id: string) => void
  onView?: (id: string) => void
}

export function EmployeeList({ onEdit, onView }: EmployeeListProps) {
  const {
    sorting,
    columnFilters,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  } = useTableParams({ defaultSort: '-created_at' })

  const { data, isLoading, error, refetch } = useEmployees(apiParams as EmployeeListParams)
  const { data: positionsData } = usePositions({ per_page: 100, 'filter[status]': 'active' } as PositionListParams)

  const filterOptions: Record<string, { label: string; value: string }[]> = {
    status: [
      { label: labels.rrhh.employees.statuses.active, value: 'active' },
      { label: labels.rrhh.employees.statuses.blocked, value: 'blocked' },
    ],
    position_id: (positionsData?.data ?? []).map((p) => ({ label: `${p.name} — ${p.area_name}`, value: String(p.id) })),
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length && Object.keys(columnFilters).length === 0 ? (
        <EmptyState message={labels.rrhh.employees.empty} />
      ) : (
        <DataTable
          columns={employeeColumns}
          data={data?.data ?? []}
          pagination={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          columnFilters={columnFilters}
          onColumnFilterChange={onColumnFilterChange}
          filterOptions={filterOptions}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          meta={{ onEdit, onView }}
        />
      )}
    </div>
  )
}
