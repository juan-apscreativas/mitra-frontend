'use client'

import { labels } from '@/lib/labels'
import type { Area } from '../types'

interface ReportsFiltersProps {
  areas: Area[]
  areaId: string | null
  onAreaChange: (areaId: string | null) => void
  employeeStatus: string | null
  onEmployeeStatusChange: (status: string | null) => void
  docStatus: string | null
  onDocStatusChange: (status: string | null) => void
  seniorityMin: string
  onSeniorityMinChange: (value: string) => void
  seniorityMax: string
  onSeniorityMaxChange: (value: string) => void
}

const l = labels.rrhh.reports.filters

const statusOptions = [
  { value: null, label: l.statusAll },
  { value: 'active', label: l.statusActive },
  { value: 'blocked', label: l.statusBlocked },
] as const

const docOptions = [
  { value: null, label: l.docAll },
  { value: 'complete', label: l.docComplete },
  { value: 'pending', label: l.docPending },
  { value: 'no_requirements', label: l.docNoRequirements },
] as const

export function ReportsFilters({
  areas,
  areaId,
  onAreaChange,
  employeeStatus,
  onEmployeeStatusChange,
  docStatus,
  onDocStatusChange,
  seniorityMin,
  onSeniorityMinChange,
  seniorityMax,
  onSeniorityMaxChange,
}: ReportsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Area select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{l.area}</label>
        <select
          value={areaId ?? ''}
          onChange={(e) => onAreaChange(e.target.value || null)}
          className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">{l.allAreas}</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {/* Employee status pills */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{l.employeeStatus}</label>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value ?? 'all'}
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

      {/* Doc status pills */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{l.docStatus}</label>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
          {docOptions.map(({ value, label }) => (
            <button
              key={value ?? 'all'}
              type="button"
              onClick={() => onDocStatusChange(value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                docStatus === value
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-foreground/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Seniority min */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{l.seniorityMin}</label>
        <input
          type="number"
          min={0}
          value={seniorityMin}
          onChange={(e) => onSeniorityMinChange(e.target.value)}
          className="w-28 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      {/* Seniority max */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">{l.seniorityMax}</label>
        <input
          type="number"
          min={0}
          value={seniorityMax}
          onChange={(e) => onSeniorityMaxChange(e.target.value)}
          className="w-28 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>
    </div>
  )
}
