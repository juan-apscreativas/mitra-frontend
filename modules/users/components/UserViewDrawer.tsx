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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DetailSection, DetailField } from '@/components/ui/detail-section'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import { useUser } from '../hooks'
import { UserFormDrawer } from './UserFormDrawer'
import type { User } from '../types'

interface UserViewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

const statusVariant: Record<User['status'], 'default' | 'secondary' | 'destructive'> = {
  active: 'default',
  inactive: 'secondary',
  blocked: 'destructive',
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

export function UserViewDrawer({ open, onOpenChange, userId }: UserViewDrawerProps) {
  const { data, isLoading, isError, error, refetch } = useUser(userId, {
    enabled: !!userId && open,
  })
  const user = data?.data
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <FormDrawer open={open} onOpenChange={onOpenChange} key={userId}>
        <FormDrawerContent>
          <FormDrawerHeader>
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user?.name ?? ''} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <FormDrawerTitle>{user?.name ?? ''}</FormDrawerTitle>
                  {user && (
                    <Badge variant={statusVariant[user.status]}>
                      {labels.users.statuses[user.status]}
                    </Badge>
                  )}
                </div>
                {user && <p className="text-sm text-muted-foreground">{user.email}</p>}
              </div>
            </div>
          </FormDrawerHeader>

          {isError ? (
            <FormDrawerBody>
              <ErrorState error={error} onRetry={refetch} />
            </FormDrawerBody>
          ) : isLoading || !user ? (
            <FormDrawerBody>
              <LoadingState />
            </FormDrawerBody>
          ) : (
            <FormDrawerBody className="space-y-6">
              <DetailSection title={labels.users.sections.info}>
                <DetailField label={labels.users.fields.phone} value={user.phone} />
                <DetailField
                  label={labels.users.lastLogin}
                  value={user.last_login_at ? formatDate(user.last_login_at) : undefined}
                />
                <DetailField
                  label={labels.common.createdAt}
                  value={formatDate(user.created_at)}
                />
              </DetailSection>

              <DetailSection title={labels.users.sections.roles}>
                {user.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 py-2">
                    {user.roles.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 text-sm text-muted-foreground">{labels.users.noRoles}</p>
                )}
              </DetailSection>
            </FormDrawerBody>
          )}

          <FormDrawerFooter className="justify-center">
            <Authorized permission="users.update">
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
        </FormDrawerContent>
      </FormDrawer>

      <UserFormDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        userId={userId}
      />
    </>
  )
}
