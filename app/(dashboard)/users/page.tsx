'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { UserList } from '@/modules/users/components/UserList'
import { UserFormDrawer } from '@/modules/users/components/UserFormDrawer'
import { UserViewDrawer } from '@/modules/users/components/UserViewDrawer'
import { useRoles } from '@/modules/roles/hooks'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'

export default function UsersPage() {
  const router = useRouter()
  const { data: rolesData } = useRoles({ per_page: 100 })
  const [drawer, setDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; userId?: string }>({ open: false, mode: 'create' })
  const [viewDrawer, setViewDrawer] = useState<{ open: boolean; userId: string }>({ open: false, userId: '' })

  const roleOptions = (rolesData?.data ?? []).map((r) => ({
    label: r.name,
    value: r.name,
  }))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{labels.users.titleFull}</h1>
        </div>
        <Authorized permission="users.create">
          <Button onClick={() => setDrawer({ open: true, mode: 'create' })}>
            <Plus className="h-4 w-4" />
            {labels.users.invite}
          </Button>
        </Authorized>
      </div>
      <UserList
        roleOptions={roleOptions}
        onView={(id) => setViewDrawer({ open: true, userId: id })}
        onEdit={(id) => setDrawer({ open: true, mode: 'edit', userId: id })}
      />
      <UserFormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((prev) => ({ ...prev, open }))}
        mode={drawer.mode}
        userId={drawer.userId}
      />
      <UserViewDrawer
        open={viewDrawer.open}
        onOpenChange={(open) => setViewDrawer((prev) => ({ ...prev, open }))}
        userId={viewDrawer.userId}
      />
    </div>
  )
}
