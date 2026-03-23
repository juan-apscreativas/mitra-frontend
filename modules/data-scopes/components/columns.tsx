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
    cell: ({ row }) => (
      <ActionsDropdown
        editHref={`/data-scopes/${row.original.id}/edit`}
        editPermission="data_scopes.update"
      />
    ),
  },
]
