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
    cell: ({ row }) => (
      <ActionsDropdown
        viewHref={`/users/${row.original.id}`}
        editHref={`/users/${row.original.id}/edit`}
        viewPermission="users.view"
        editPermission="users.update"
      />
    ),
  },
]
