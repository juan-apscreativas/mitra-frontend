'use client'

import { useState, useMemo, useCallback } from 'react'
import { labels } from '@/lib/labels'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { useOrgChart } from '../hooks/use-org-chart'
import { useAreas } from '../hooks/use-areas'
import { OrgChartFilters } from './OrgChartFilters'
import { OrgChartTree } from './OrgChartTree'
import { OrgChartNodeDetailDrawer } from './OrgChartNodeDetailDrawer'

interface OrgChartProps {
  onViewEmployee: (employeeId: string) => void
}

export function OrgChart({ onViewEmployee }: OrgChartProps) {
  const { data, isLoading, isError, error, refetch } = useOrgChart()
  const { data: areasData } = useAreas({ per_page: 100, 'filter[status]': 'active' })

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [employeeStatus, setEmployeeStatus] = useState<'all' | 'active' | 'blocked'>('all')
  const [detailDrawer, setDetailDrawer] = useState<{ open: boolean; positionId: string | null }>({
    open: false,
    positionId: null,
  })

  const nodes = useMemo(() => data?.data ?? [], [data])
  const areas = areasData?.data ?? []

  const selectedNode = useMemo(() => {
    if (!detailDrawer.positionId) return null
    return nodes.find((n) => String(n.id) === detailDrawer.positionId) ?? null
  }, [nodes, detailDrawer.positionId])

  const handleNodeClick = useCallback((positionId: string) => {
    setDetailDrawer({ open: true, positionId })
  }, [])

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState error={error} onRetry={refetch} />
  if (nodes.length === 0) return <EmptyState message={labels.rrhh.orgChart.empty} />

  return (
    <div className="space-y-4">
      <OrgChartFilters
        areas={areas}
        selectedAreaId={selectedAreaId}
        onAreaChange={setSelectedAreaId}
        employeeStatus={employeeStatus}
        onEmployeeStatusChange={setEmployeeStatus}
      />

      <div className="overflow-x-auto py-2">
        <OrgChartTree
          nodes={nodes}
          selectedAreaId={selectedAreaId}
          employeeStatus={employeeStatus}
          onNodeClick={handleNodeClick}
        />
      </div>

      <OrgChartNodeDetailDrawer
        open={detailDrawer.open}
        onOpenChange={(open) => setDetailDrawer((prev) => ({ ...prev, open }))}
        node={selectedNode}
        employeeStatus={employeeStatus}
        onViewEmployee={onViewEmployee}
      />
    </div>
  )
}
