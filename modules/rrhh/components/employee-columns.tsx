'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { Employee } from '../types'

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: labels.rrhh.employees.fields.name,
    meta: { filterType: 'text' },
  },
  {
    id: 'position_id',
    accessorKey: 'position_name',
    header: labels.rrhh.employees.fields.position,
    meta: { filterType: 'select' },
  },
  {
    accessorKey: 'area_name',
    header: labels.rrhh.employees.fields.area,
    enableSorting: false,
  },
  {
    accessorKey: 'hired_at',
    header: labels.rrhh.employees.fields.hiredAt,
    cell: ({ row }) => {
      const raw = row.original.hired_at
      if (!raw) return <span className="text-muted-foreground">—</span>
      return new Date(raw).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
    },
  },
  {
    accessorKey: 'seniority_years',
    header: labels.rrhh.employees.fields.seniority,
    enableSorting: false,
    cell: ({ row }) => {
      const years = row.original.seniority_years
      return years != null ? `${years.toFixed(1)} ${labels.rrhh.employees.seniorityYears}` : '—'
    },
  },
  {
    accessorKey: 'location',
    header: labels.rrhh.employees.fields.location,
    enableSorting: false,
    cell: ({ row }) => {
      const loc = row.original.location
      return loc ?? <span className="text-muted-foreground">—</span>
    },
  },
  {
    accessorKey: 'status',
    header: labels.rrhh.employees.fields.status,
    meta: { filterType: 'select' },
    cell: ({ row }) => {
      const status = row.original.status
      if (status === 'active') {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
            {labels.rrhh.employees.statuses.active}
          </Badge>
        )
      }
      return <Badge variant="destructive">{labels.rrhh.employees.statuses.blocked}</Badge>
    },
  },
  {
    id: 'docs_compliance',
    header: labels.rrhh.employees.fields.documents,
    enableSorting: false,
    cell: ({ row }) => {
      const { required_docs_total, required_docs_uploaded, is_docs_complete } = row.original
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {required_docs_uploaded}/{required_docs_total} {labels.rrhh.employees.docs.required.toLowerCase()}
          </span>
          {is_docs_complete ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border text-xs">
              {labels.rrhh.employees.docs.complete}
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 border text-xs">
              {labels.rrhh.employees.docs.incomplete}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onView?: (id: string) => void
        onEdit?: (id: string) => void
        onBlock?: (id: string) => void
        onUnblock?: (id: string) => void
      } | undefined
      const employee = row.original
      return (
        <ActionsDropdown
          onView={() => meta?.onView?.(employee.id)}
          onEdit={() => meta?.onEdit?.(employee.id)}
          viewPermission="employees.view"
          editPermission="employees.update"
        />
      )
    },
  },
]
