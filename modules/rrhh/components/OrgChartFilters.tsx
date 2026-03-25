'use client'

import { labels } from '@/lib/labels'
import type { Area } from '../types'

interface OrgChartFiltersProps {
  areas: Area[]
  selectedAreaId: string | null
  onAreaChange: (areaId: string | null) => void
  employeeStatus: 'all' | 'active' | 'blocked'
  onEmployeeStatusChange: (status: 'all' | 'active' | 'blocked') => void
}

const statusOptions = [
  { value: 'all' as const, label: labels.rrhh.orgChart.statusAll },
  { value: 'active' as const, label: labels.rrhh.orgChart.statusActive },
  { value: 'blocked' as const, label: labels.rrhh.orgChart.statusBlocked },
]

export function OrgChartFilters({
  areas,
  selectedAreaId,
  onAreaChange,
  employeeStatus,
  onEmployeeStatusChange,
}: OrgChartFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={selectedAreaId ?? ''}
        onChange={(e) => onAreaChange(e.target.value || null)}
        className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <option value="">{labels.rrhh.orgChart.allAreas}</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
        {statusOptions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onEmployeeStatusChange(value)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              employeeStatus === value
                ? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
