'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { Document } from '../types'

export const documentColumns: ColumnDef<Document>[] = [
  {
    accessorKey: 'name',
    header: labels.rrhh.documents.fields.name,
    meta: { filterType: 'text' },
  },
  {
    accessorKey: 'description',
    header: labels.rrhh.documents.fields.description,
    enableSorting: false,
    cell: ({ row }) => {
      const desc = row.original.description
      if (!desc) return <span className="text-muted-foreground">—</span>
      return (
        <span className="max-w-[200px] truncate block" title={desc}>
          {desc}
        </span>
      )
    },
  },
  {
    accessorKey: 'is_required_by_default',
    header: labels.rrhh.documents.fields.isRequiredByDefault,
    enableSorting: false,
    cell: ({ row }) => {
      const isRequired = row.original.is_required_by_default
      if (isRequired) {
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
            {labels.rrhh.positions.documentsSection.required}
          </Badge>
        )
      }
      return (
        <Badge variant="secondary">
          {labels.rrhh.positions.documentsSection.optional}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'positions_count',
    header: labels.rrhh.documents.fields.positionsCount,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: labels.rrhh.documents.fields.status,
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
          editPermission="documents.update"
        />
      )
    },
  },
]
