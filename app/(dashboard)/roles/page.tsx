'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { RoleList } from '@/modules/roles/components/RoleList'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'

export default function RolesPage() {
  const router = useRouter()

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
          <Button nativeButton={false} render={<Link href="/roles/new" />}>
            <Plus className="h-4 w-4" />
            {labels.roles.invite}
          </Button>
        </Authorized>
      </div>
      <RoleList />
    </div>
  )
}
