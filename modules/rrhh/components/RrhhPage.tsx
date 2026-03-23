'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import type { RrhhTab } from '../types'
import { RrhhStats } from './RrhhStats'
import { RrhhTabs } from './RrhhTabs'
import { AreaList } from './AreaList'
import { AreaFormDrawer } from './AreaFormDrawer'
import { DocumentList } from './DocumentList'
import { DocumentFormDrawer } from './DocumentFormDrawer'
import { PositionList } from './PositionList'
import { PositionFormDrawer } from './PositionFormDrawer'

const tabPermissions: Record<string, string> = {
  areas: 'rrhh.areas.create',
  positions: 'rrhh.positions.create',
  documentation: 'rrhh.documents.create',
}

const tabCreateLabels: Record<string, string> = {
  areas: labels.rrhh.areas.create,
  positions: labels.rrhh.positions.create,
  documentation: labels.rrhh.documents.create,
}

export function RrhhPage() {
  const [activeTab, setActiveTab] = useState<RrhhTab>('areas')

  const [areaDrawer, setAreaDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; areaId?: string }>({
    open: false,
    mode: 'create',
  })
  const [documentDrawer, setDocumentDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; documentId?: string }>({
    open: false,
    mode: 'create',
  })
  const [positionDrawer, setPositionDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; positionId?: string }>({
    open: false,
    mode: 'create',
  })

  function handleCreate() {
    if (activeTab === 'areas') {
      setAreaDrawer({ open: true, mode: 'create' })
    } else if (activeTab === 'positions') {
      setPositionDrawer({ open: true, mode: 'create' })
    } else if (activeTab === 'documentation') {
      setDocumentDrawer({ open: true, mode: 'create' })
    }
  }

  const createPermission = tabPermissions[activeTab]
  const createLabel = tabCreateLabels[activeTab]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{labels.rrhh.title}</h1>
        <p className="text-sm text-muted-foreground">{labels.rrhh.subtitle}</p>
      </div>

      <RrhhStats />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <RrhhTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        {createPermission && createLabel && (
          <Authorized permission={createPermission}>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              {createLabel}
            </Button>
          </Authorized>
        )}
      </div>

      <div className="rounded-xl bg-background ring-1 ring-foreground/10 p-6">
        {activeTab === 'areas' && (
          <AreaList
            onEdit={(id) => setAreaDrawer({ open: true, mode: 'edit', areaId: id })}
          />
        )}
        {activeTab === 'positions' && (
          <PositionList
            onEdit={(id) => setPositionDrawer({ open: true, mode: 'edit', positionId: id })}
          />
        )}
        {activeTab === 'documentation' && (
          <DocumentList
            onEdit={(id) => setDocumentDrawer({ open: true, mode: 'edit', documentId: id })}
          />
        )}
      </div>

      <AreaFormDrawer
        open={areaDrawer.open}
        onOpenChange={(open) => setAreaDrawer((prev) => ({ ...prev, open }))}
        mode={areaDrawer.mode}
        areaId={areaDrawer.areaId}
      />
      <DocumentFormDrawer
        open={documentDrawer.open}
        onOpenChange={(open) => setDocumentDrawer((prev) => ({ ...prev, open }))}
        mode={documentDrawer.mode}
        documentId={documentDrawer.documentId}
      />
      <PositionFormDrawer
        open={positionDrawer.open}
        onOpenChange={(open) => setPositionDrawer((prev) => ({ ...prev, open }))}
        mode={positionDrawer.mode}
        positionId={positionDrawer.positionId}
      />
    </div>
  )
}
