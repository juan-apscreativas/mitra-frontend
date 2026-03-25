'use client'

import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { labels } from '@/lib/labels'
import type { ReportsEmployeeSummary } from '../types'

const l = labels.rrhh.reports.table
const col = l.columns

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const columnHelper = createColumnHelper<ReportsEmployeeSummary>()

const reportsEmployeeColumns: ColumnDef<ReportsEmployeeSummary, unknown>[] = [
  columnHelper.accessor('name', {
    header: col.name,
    cell: ({ row, table }) => {
      const { name, avatar_url, id } = row.original
      const meta = table.options.meta as Record<string, unknown> | undefined
      const onView = meta?.onView as ((id: string) => void) | undefined
      return (
        <button
          type="button"
          onClick={() => onView?.(String(id))}
          className="flex items-center gap-2 text-left hover:underline"
        >
          <Avatar className="h-7 w-7">
            {avatar_url ? <AvatarImage src={avatar_url} alt={name} /> : null}
            <AvatarFallback className="text-[10px]">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{name}</span>
        </button>
      )
    },
  }) as ColumnDef<ReportsEmployeeSummary, unknown>,
  columnHelper.accessor('position_name', {
    header: col.position,
    enableSorting: false,
  }) as ColumnDef<ReportsEmployeeSummary, unknown>,
  columnHelper.accessor('area_name', {
    header: col.area,
    enableSorting: false,
  }) as ColumnDef<ReportsEmployeeSummary, unknown>,
  columnHelper.accessor('seniority_years', {
    header: col.seniority,
    cell: ({ getValue }) => `${getValue()} ${l.years}`,
  }) as ColumnDef<ReportsEmployeeSummary, unknown>,
  columnHelper.accessor('doc_status', {
    header: col.docStatus,
    enableSorting: false,
    cell: ({ row }) => {
      const { doc_status, required_docs_uploaded, required_docs_total } = row.original
      if (doc_status === 'complete') {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
            {labels.rrhh.reports.charts.complete}
          </Badge>
        )
      }
      if (doc_status === 'pending') {
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
            {required_docs_uploaded}/{required_docs_total}
          </Badge>
        )
      }
      return (
        <Badge variant="outline">
          {labels.rrhh.reports.charts.noRequirements}
        </Badge>
      )
    },
  }) as ColumnDef<ReportsEmployeeSummary, unknown>,
  columnHelper.accessor('status', {
    header: col.status,
    cell: ({ getValue }) => {
      const status = getValue()
      if (status === 'active') {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
            {labels.rrhh.employees.statuses.active}
          </Badge>
        )
      }
      return <Badge variant="destructive">{labels.rrhh.employees.statuses.blocked}</Badge>
    },
  }) as ColumnDef<ReportsEmployeeSummary, unknown>,
]

interface ReportsEmployeeTableProps {
  data: ReportsEmployeeSummary[]
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  onViewEmployee: (employeeId: string) => void
}

export function ReportsEmployeeTable({
  data,
  pagination,
  onPageChange,
  onPerPageChange,
  onViewEmployee,
}: ReportsEmployeeTableProps) {
  const meta = useMemo(() => ({ onView: onViewEmployee }), [onViewEmployee])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{l.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={reportsEmployeeColumns}
          data={data}
          pagination={pagination}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          meta={meta}
        />
      </CardContent>
    </Card>
  )
}
