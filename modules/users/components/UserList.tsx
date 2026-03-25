'use client'

import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useTableParams } from '@/lib/use-table-params'
import { useUsers } from '../hooks'
import { columns } from './columns'
import type { UserListParams } from '../types'

interface UserListProps {
  roleOptions?: { label: string; value: string }[]
  onView?: (id: string) => void
  onEdit?: (id: string) => void
}

export function UserList({ roleOptions = [], onView, onEdit }: UserListProps) {
  const {
    sorting,
    columnFilters,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  } = useTableParams({ defaultSort: '-created_at' })

  const { data, isLoading, error, refetch } = useUsers(
    apiParams as UserListParams
  )

  const filterOptions: Record<string, { label: string; value: string }[]> = {
    role: roleOptions,
    status: [
      { label: labels.users.statuses.active, value: 'active' },
      { label: labels.users.statuses.inactive, value: 'inactive' },
      { label: labels.users.statuses.blocked, value: 'blocked' },
    ],
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length && Object.keys(columnFilters).length === 0 ? (
        <EmptyState message={labels.users.empty} />
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
          meta={{ onView, onEdit }}
        />
      )}
    </div>
  )
}
