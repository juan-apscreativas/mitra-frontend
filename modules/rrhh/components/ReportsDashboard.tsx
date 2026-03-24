'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useReportsData } from '../hooks/use-reports'
import { useAreas } from '../hooks/use-areas'
import { ReportsFilters } from './ReportsFilters'
import { ReportsCharts } from './ReportsCharts'
import { ReportsPendingList } from './ReportsPendingList'
import { ReportsEmployeeTable } from './ReportsEmployeeTable'
import type { ReportsFilterParams } from '../types'

interface ReportsDashboardProps {
  onViewEmployee: (employeeId: string) => void
}

export function ReportsDashboard({ onViewEmployee }: ReportsDashboardProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: areasData } = useAreas({ per_page: 100, 'filter[status]': 'active' })
  const areas = areasData?.data ?? []

  // Read filter state from URL
  const areaId = searchParams.get('report_area') ?? null
  const employeeStatus = searchParams.get('report_status') ?? null
  const docStatus = searchParams.get('report_doc') ?? null
  const seniorityMin = searchParams.get('report_smin') ?? ''
  const seniorityMax = searchParams.get('report_smax') ?? ''
  const page = Number(searchParams.get('report_page')) || 1
  const perPage = Number(searchParams.get('report_per_page')) || 10
  const sort = searchParams.get('report_sort') ?? undefined

  // Build API params
  const apiParams = useMemo<ReportsFilterParams>(() => {
    const params: ReportsFilterParams = { page, per_page: perPage }
    if (areaId) params['filter[area_id]'] = areaId
    if (employeeStatus) params['filter[employee_status]'] = employeeStatus
    if (docStatus) params['filter[doc_status]'] = docStatus
    if (seniorityMin) params['filter[seniority_min]'] = seniorityMin
    if (seniorityMax) params['filter[seniority_max]'] = seniorityMax
    if (sort) params.sort = sort
    return params
  }, [areaId, employeeStatus, docStatus, seniorityMin, seniorityMax, page, perPage, sort])

  const { data, isLoading, error, refetch } = useReportsData(apiParams)

  const updateParam = useCallback(
    (key: string, value: string | null, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      if (resetPage && key !== 'report_page') {
        params.delete('report_page')
      }
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  if (error) return <ErrorState error={error} onRetry={refetch} />

  const reports = data?.data
  const metrics = reports?.metrics ?? []
  const hasData = metrics.some((m) => m.key === 'headcount' && Number(m.value) > 0)

  return (
    <div className="space-y-6">
      <ReportsFilters
        areas={areas}
        areaId={areaId}
        onAreaChange={(v) => updateParam('report_area', v)}
        employeeStatus={employeeStatus}
        onEmployeeStatusChange={(v) => updateParam('report_status', v)}
        docStatus={docStatus}
        onDocStatusChange={(v) => updateParam('report_doc', v)}
        seniorityMin={seniorityMin}
        onSeniorityMinChange={(v) => updateParam('report_smin', v || null)}
        seniorityMax={seniorityMax}
        onSeniorityMaxChange={(v) => updateParam('report_smax', v || null)}
      />

      {isLoading ? (
        <LoadingState />
      ) : !hasData ? (
        <EmptyState message={labels.rrhh.reports.empty} />
      ) : (
        <>
          <ReportsCharts
            areaDistribution={reports?.charts.area_distribution ?? []}
            positionOccupancy={reports?.charts.position_occupancy ?? []}
            docCompliance={reports?.charts.doc_compliance ?? []}
          />

          <ReportsPendingList
            items={reports?.pending_documents ?? []}
            onViewEmployee={onViewEmployee}
          />

          <ReportsEmployeeTable
            data={reports?.employees.data ?? []}
            pagination={reports?.employees.meta}
            onPageChange={(p) => updateParam('report_page', String(p), false)}
            onPerPageChange={(pp) => updateParam('report_per_page', String(pp))}
            onViewEmployee={onViewEmployee}
          />
        </>
      )}
    </div>
  )
}
