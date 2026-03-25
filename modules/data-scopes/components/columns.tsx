'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { DataScopeRule } from '../types'

export const columns: ColumnDef<DataScopeRule>[] = [
  {
    accessorKey: 'name',
    header: labels.dataScopes.fields.name,
    meta: { filterType: 'text' },
  },
  {
    id: 'entity',
    accessorKey: 'entity_label',
    header: labels.dataScopes.fields.entity,
    meta: { filterType: 'select' },
  },
  {
    accessorKey: 'type',
    header: labels.dataScopes.fields.type,
    meta: { filterType: 'select' },
    cell: ({ row }) => (
      <Badge variant="secondary">
        {labels.dataScopes.types[row.original.type]}
      </Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: labels.dataScopes.fields.description,
    meta: { filterType: 'text' },
    cell: ({ row }) => row.original.description ?? '—',
  },
  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onView?: (id: string) => void; onEdit?: (id: string) => void } | undefined
      return (
        <ActionsDropdown
          onView={() => meta?.onView?.(row.original.id)}
          onEdit={() => meta?.onEdit?.(row.original.id)}
          viewPermission="data_scopes.view"
          editPermission="data_scopes.update"
        />
      )
    },
  },
]
