'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { DataScopeRuleList } from '@/modules/data-scopes/components/DataScopeRuleList'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'

export default function DataScopesPage() {
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
          <h1 className="text-2xl font-bold">{labels.dataScopes.title}</h1>
        </div>
        <Authorized permission="data_scopes.create">
          <Button nativeButton={false} render={<Link href="/data-scopes/new" />}>
            <Plus className="h-4 w-4" />
            {labels.dataScopes.invite}
          </Button>
        </Authorized>
      </div>
      <DataScopeRuleList />
    </div>
  )
}
