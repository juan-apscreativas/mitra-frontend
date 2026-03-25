'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerBody,
  FormDrawerFooter,
} from '@/components/ui/form-drawer'
import { DetailSection, DetailField } from '@/components/ui/detail-section'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import { useRole } from '../hooks'
import { RoleFormDrawer } from './RoleFormDrawer'

interface RoleViewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleId: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RoleViewDrawer({ open, onOpenChange, roleId }: RoleViewDrawerProps) {
  const { data, isLoading, isError, error, refetch } = useRole(roleId, {
    enabled: !!roleId && open,
  })
  const role = data?.data
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <FormDrawer open={open} onOpenChange={onOpenChange} key={roleId}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <div className="flex items-center gap-2">
              <FormDrawerTitle>{role?.name ?? ''}</FormDrawerTitle>
              {role?.is_system && (
                <Badge variant="secondary">
                  {labels.roles.systemProtected}
                </Badge>
              )}
            </div>
          </FormDrawerHeader>

          {isError ? (
            <FormDrawerBody>
              <ErrorState error={error} onRetry={refetch} />
            </FormDrawerBody>
          ) : isLoading || !role ? (
            <FormDrawerBody>
              <LoadingState />
            </FormDrawerBody>
          ) : (
            <FormDrawerBody className="space-y-6">
              <DetailSection title={labels.roles.sections.info}>
                <DetailField
                  label={labels.roles.fields.description}
                  value={role.description}
                />
                <DetailField
                  label={labels.roles.fields.usersCount}
                  value={String(role.users_count)}
                />
                <DetailField
                  label={labels.roles.fields.permissionsCount}
                  value={String(role.permissions_count)}
                />
                <DetailField
                  label={labels.common.createdAt}
                  value={formatDate(role.created_at)}
                />
              </DetailSection>
            </FormDrawerBody>
          )}

          {!role?.is_system && (
            <FormDrawerFooter className="justify-center">
              <Authorized permission="roles.update">
                <Button
                  className="w-full"
                  onClick={() => {
                    onOpenChange(false)
                    setTimeout(() => setEditOpen(true), 220)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  {labels.common.edit}
                </Button>
              </Authorized>
            </FormDrawerFooter>
          )}
        </FormDrawerContent>
      </FormDrawer>

      <RoleFormDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        roleId={roleId}
      />
    </>
  )
}
