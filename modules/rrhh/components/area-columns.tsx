'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { Area } from '../types'

export const areaColumns: ColumnDef<Area>[] = [
  {
    accessorKey: 'name',
    header: labels.rrhh.areas.fields.name,
    meta: { filterType: 'text' },
  },
  {
    accessorKey: 'active_positions_count',
    header: labels.rrhh.areas.fields.activePositions,
    enableSorting: false,
  },
  {
    id: 'used_positions',
    header: labels.rrhh.areas.fields.usedPositions,
    enableSorting: false,
    cell: ({ row }) => row.original.used_positions,
  },
  {
    accessorKey: 'status',
    header: labels.rrhh.areas.fields.status,
    meta: { filterType: 'select' },
    cell: ({ row }) => {
      const status = row.original.status
      if (status === 'active') {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
            {labels.rrhh.statuses.active}
          </Badge>
        )
      }
      return <Badge variant="destructive">{labels.rrhh.statuses.inactive}</Badge>
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onEdit?: (id: string) => void
      } | undefined
      return (
        <ActionsDropdown
          onEdit={() => meta?.onEdit?.(row.original.id)}
          editPermission="areas.update"
        />
      )
    },
  },
]
