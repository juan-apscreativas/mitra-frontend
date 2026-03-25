'use client'

import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useTableParams } from '@/lib/use-table-params'
import { useDocuments } from '../hooks/use-documents'
import { documentColumns } from './document-columns'
import type { DocumentListParams } from '../types'

interface DocumentListProps {
  onEdit?: (id: string) => void
}

export function DocumentList({ onEdit }: DocumentListProps) {
  const {
    sorting,
    columnFilters,
    apiParams,
    onSortingChange,
    onColumnFilterChange,
    onPageChange,
    onPerPageChange,
  } = useTableParams({ defaultSort: '-created_at' })

  const { data, isLoading, error, refetch } = useDocuments(apiParams as DocumentListParams)

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
        <EmptyState message={labels.rrhh.documents.empty} />
      ) : (
        <DataTable
          columns={documentColumns}
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
