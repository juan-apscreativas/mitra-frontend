'use client'

import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePermissions } from '@/lib/permissions'
import { labels } from '@/lib/labels'

interface ActionsDropdownProps {
  viewHref?: string
  editHref?: string
  onView?: () => void
  onEdit?: () => void
  detailHref?: string
  viewPermission?: string
  editPermission?: string
  detailPermission?: string
}

export function ActionsDropdown({
  viewHref,
  editHref,
  onView,
  onEdit,
  detailHref,
  viewPermission,
  editPermission,
  detailPermission,
}: ActionsDropdownProps) {
  const { can } = usePermissions()

  const showView = (viewHref || onView) && (!viewPermission || can(viewPermission))
  const showEdit = (editHref || onEdit) && (!editPermission || can(editPermission))
  const showDetail = detailHref && (!detailPermission || can(detailPermission))

  if (!showView && !showEdit && !showDetail) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{labels.common.actions}</span>
          </Button>
        }
      />
      <DropdownMenuContent>
        {showView && onView && (
          <DropdownMenuItem onClick={onView}>
            {labels.common.view}
          </DropdownMenuItem>
        )}
        {showView && !onView && viewHref && (
          <DropdownMenuItem render={<Link href={viewHref!} />}>
            {labels.common.view}
          </DropdownMenuItem>
        )}
        {showEdit && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            {labels.common.edit}
          </DropdownMenuItem>
        )}
        {showEdit && !onEdit && editHref && (
          <DropdownMenuItem render={<Link href={editHref!} />}>
            {labels.common.edit}
          </DropdownMenuItem>
        )}
        {showDetail && (
          <DropdownMenuItem render={<Link href={detailHref!} />}>
            {labels.common.manage}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
