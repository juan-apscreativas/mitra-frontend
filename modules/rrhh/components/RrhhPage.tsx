'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { EmployeeList } from './EmployeeList'
import { EmployeeFormDrawer } from './EmployeeFormDrawer'
import { EmployeeDetailDrawer } from './EmployeeDetailDrawer'
import { OrgChart } from './OrgChart'
import { ReportsDashboard } from './ReportsDashboard'

const tabPermissions: Record<string, string> = {
  employees: 'employees.create',
  areas: 'areas.create',
  positions: 'positions.create',
  documentation: 'documents.create',
}

const tabCreateLabels: Record<string, string> = {
  employees: labels.rrhh.employees.create,
  areas: labels.rrhh.areas.create,
  positions: labels.rrhh.positions.create,
  documentation: labels.rrhh.documents.create,
}

const VALID_TABS: RrhhTab[] = ['org-chart', 'employees', 'positions', 'areas', 'documentation', 'reports']
const DEFAULT_TAB: RrhhTab = 'employees'

export function RrhhPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tabParam = searchParams.get('tab') as RrhhTab | null
  const activeTab: RrhhTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : DEFAULT_TAB

  const setActiveTab = useCallback((tab: RrhhTab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  const [employeeDrawer, setEmployeeDrawer] = useState<{ open: boolean; mode: 'create' | 'edit'; employeeId?: string }>({
    open: false,
    mode: 'create',
  })
  const [employeeDetailDrawer, setEmployeeDetailDrawer] = useState<{ open: boolean; employeeId?: string }>({
    open: false,
  })
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
    if (activeTab === 'employees') {
      setEmployeeDrawer({ open: true, mode: 'create' })
    } else if (activeTab === 'areas') {
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

      <RrhhStats activeTab={activeTab} />

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

      {activeTab === 'reports' ? (
        <ReportsDashboard
          onViewEmployee={(id) => setEmployeeDetailDrawer({ open: true, employeeId: id })}
        />
      ) : (
        <div className="rounded-xl bg-background ring-1 ring-foreground/10 p-6">
          {activeTab === 'org-chart' && (
            <OrgChart
              onViewEmployee={(id) => setEmployeeDetailDrawer({ open: true, employeeId: id })}
            />
          )}
          {activeTab === 'employees' && (
            <EmployeeList
              onEdit={(id) => setEmployeeDrawer({ open: true, mode: 'edit', employeeId: id })}
              onView={(id) => setEmployeeDetailDrawer({ open: true, employeeId: id })}
            />
          )}
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
      )}

      <EmployeeFormDrawer
        open={employeeDrawer.open}
        onOpenChange={(open) => setEmployeeDrawer((prev) => ({ ...prev, open }))}
        mode={employeeDrawer.mode}
        employeeId={employeeDrawer.employeeId}
      />
      <EmployeeDetailDrawer
        open={employeeDetailDrawer.open}
        onOpenChange={(open) => setEmployeeDetailDrawer((prev) => ({ ...prev, open }))}
        employeeId={employeeDetailDrawer.employeeId}
      />
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
