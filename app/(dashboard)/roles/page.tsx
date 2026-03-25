'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { RoleList } from '@/modules/roles/components/RoleList'
import { RoleFormDrawer } from '@/modules/roles/components/RoleFormDrawer'
import { RoleViewDrawer } from '@/modules/roles/components/RoleViewDrawer'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'

export default function RolesPage() {
  const router = useRouter()
  const [drawer, setDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; roleId?: string }>({ open: false, mode: 'create' })
  const [viewDrawer, setViewDrawer] = useState<{ open: boolean; roleId: string }>({ open: false, roleId: '' })

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
          <h1 className="text-2xl font-bold">{labels.roles.title}</h1>
        </div>
        <Authorized permission="roles.create">
          <Button onClick={() => setDrawer({ open: true, mode: 'create' })}>
            <Plus className="h-4 w-4" />
            {labels.roles.invite}
          </Button>
        </Authorized>
      </div>
      <RoleList
        onView={(id) => setViewDrawer({ open: true, roleId: id })}
        onEdit={(id) => setDrawer({ open: true, mode: 'edit', roleId: id })}
      />
      <RoleFormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((prev) => ({ ...prev, open }))}
        mode={drawer.mode}
        roleId={drawer.roleId}
      />
      <RoleViewDrawer
        open={viewDrawer.open}
        onOpenChange={(open) => setViewDrawer((prev) => ({ ...prev, open }))}
        roleId={viewDrawer.roleId}
      />
    </div>
  )
}
