'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { User } from '../types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} ${hours}:${minutes}`
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: labels.users.fields.name,
    meta: { filterType: 'text' },
  },
  {
    accessorKey: 'email',
    header: labels.users.fields.email,
    meta: { filterType: 'text' },
  },
  {
    id: 'role',
    accessorKey: 'roles',
    header: labels.users.roles,
    enableSorting: false,
    meta: { filterType: 'select' },
    cell: ({ row }) => {
      const roles = row.original.roles
      if (!roles.length) {
        return <span className="text-muted-foreground">{labels.users.noRoles}</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role.id} variant="default">
              {role.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: labels.users.fields.status,
    meta: { filterType: 'select' },
    cell: ({ row }) => {
      const status = row.original.status
      if (status === 'active') {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
            {labels.users.statuses.active}
          </Badge>
        )
      }
      if (status === 'blocked') {
        return <Badge variant="destructive">{labels.users.statuses.blocked}</Badge>
      }
      return (
        <Badge className="bg-destructive/10 text-destructive">
          {labels.users.statuses.inactive}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'last_login_at',
    header: labels.users.lastLogin,
    cell: ({ row }) => {
      const date = row.getValue<string | null>('last_login_at')
      return date ? formatDate(date) : '—'
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onView?: (id: string) => void
        onEdit?: (id: string) => void
      } | undefined
      return (
        <ActionsDropdown
          onView={() => meta?.onView?.(row.original.id)}
          onEdit={() => meta?.onEdit?.(row.original.id)}
          detailHref={`/users/${row.original.id}`}
          viewPermission="users.view"
          editPermission="users.update"
          detailPermission="users.view"
        />
      )
    },
  },
]
