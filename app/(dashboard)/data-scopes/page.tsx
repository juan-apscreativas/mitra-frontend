'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { DataScopeRuleList } from '@/modules/data-scopes/components/DataScopeRuleList'
import { DataScopeRuleBuilderDrawer } from '@/modules/data-scopes/components/DataScopeRuleBuilderDrawer'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'

export default function DataScopesPage() {
  const router = useRouter()
  const [drawer, setDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; ruleId?: string }>({ open: false, mode: 'create' })

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
          <Button onClick={() => setDrawer({ open: true, mode: 'create' })}>
            <Plus className="h-4 w-4" />
            {labels.dataScopes.invite}
          </Button>
        </Authorized>
      </div>
      <DataScopeRuleList
        onEdit={(id) => setDrawer({ open: true, mode: 'edit', ruleId: id })}
      />
      <DataScopeRuleBuilderDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((prev) => ({ ...prev, open }))}
        mode={drawer.mode}
        ruleId={drawer.ruleId}
      />
    </div>
  )
}
