'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { UserList } from '@/modules/users/components/UserList'
import { useRoles } from '@/modules/roles/hooks'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'

export default function UsersPage() {
  const router = useRouter()
  const { data: rolesData } = useRoles({ per_page: 100 })

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
          <Button nativeButton={false} render={<Link href="/users/new" />}>
            <Plus className="h-4 w-4" />
            {labels.users.invite}
          </Button>
        </Authorized>
      </div>
      <UserList roleOptions={roleOptions} />
    </div>
  )
}
