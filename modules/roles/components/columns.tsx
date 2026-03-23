'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { labels } from '@/lib/labels'
import { RoleActions } from './RoleActions'
import type { Role } from '../types'

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: labels.roles.fields.name,
    meta: { filterType: 'text' },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.name}
        {row.original.is_system && (
          <Badge variant="secondary">{labels.roles.systemProtected}</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: labels.roles.fields.description,
    meta: { filterType: 'text' },
    cell: ({ row }) => row.original.description ?? '—',
  },
  {
    accessorKey: 'users_count',
    header: labels.roles.fields.usersCount,
  },
  {
    accessorKey: 'permissions_count',
    header: labels.roles.fields.permissionsCount,
  },
  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row, table }) => (
      <RoleActions
        role={row.original}
        onEdit={() => (table.options.meta as { onEdit?: (id: string) => void })?.onEdit?.(row.original.id)}
      />
    ),
  },
]
