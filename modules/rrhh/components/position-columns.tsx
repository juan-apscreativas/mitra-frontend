'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { Position } from '../types'

export const positionColumns: ColumnDef<Position>[] = [
  {
    accessorKey: 'name',
    header: labels.rrhh.positions.fields.name,
    meta: { filterType: 'text' },
  },
  {
    id: 'area_id',
    accessorKey: 'area_name',
    header: labels.rrhh.positions.fields.area,
    meta: { filterType: 'select' },
  },
  {
    accessorKey: 'authorized_positions',
    header: labels.rrhh.positions.fields.authorizedPositions,
  },
  {
    accessorKey: 'occupied_positions',
    header: labels.rrhh.positions.fields.occupiedPositions,
    enableSorting: false,
    cell: ({ row }) => {
      const occupied = row.original.occupied_positions
      const authorized = row.original.authorized_positions
      const ratio = authorized > 0 ? occupied / authorized : 0
      const isNearFull = ratio >= 0.8 && occupied < authorized
      const isFull = occupied >= authorized
      return (
        <span className={isFull ? 'text-destructive font-medium' : isNearFull ? 'text-amber-700 font-medium' : ''}>
          {occupied} / {authorized}
        </span>
      )
    },
  },
  {
    accessorKey: 'reports_to_name',
    header: labels.rrhh.positions.fields.reportsTo,
    enableSorting: false,
    cell: ({ row }) => {
      const name = row.original.reports_to_name
      return name ?? <span className="text-muted-foreground">—</span>
    },
  },
  {
    id: 'documents',
    header: labels.rrhh.positions.fields.documents,
    enableSorting: false,
    cell: ({ row }) => {
      const docs = row.original.documents
      if (!docs.length) return <span className="text-muted-foreground">—</span>
      return (
        <div className="flex flex-wrap gap-1">
          {docs.map((doc) => (
            <Badge
              key={doc.document_id}
              variant={doc.is_required ? 'default' : 'secondary'}
              className="text-xs"
            >
              {doc.document_name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: labels.rrhh.positions.fields.status,
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
          editPermission="positions.update"
        />
      )
    },
  },
]
