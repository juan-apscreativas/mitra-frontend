'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useRole } from '../hooks'
import { RoleForm } from './RoleForm'

interface RoleFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  roleId?: string
}

export function RoleFormDrawer({ open, onOpenChange, mode, roleId }: RoleFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = useRole(roleId ?? '', { enabled: isEdit && !!roleId && open })
  const role = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${role?.name ?? ''}`
    : labels.roles.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${roleId}`} open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <RoleForm
            mode={mode}
            roleId={roleId}
            defaultValues={
              isEdit && role
                ? {
                    name: role.name,
                    description: role.description ?? '',
                  }
                : undefined
            }
            onSuccess={handleSuccess}
          />
        )}
      </FormDrawerContent>
    </FormDrawer>
  )
}
